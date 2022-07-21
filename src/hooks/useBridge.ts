import { useStore } from "@/store";
import { ethers } from "ethers";
import { RelaychainApi, ParachainApi } from "./SubstrateApi";
import { computed, ref, watch, watchEffect, type Ref } from "vue";
import type { AssetDetails, AssetMetadata } from "@polkadot/types/interfaces";
import { getInjector } from "./useExtensions";
import { u8aToHex } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";
import type { ApiPromise } from "@polkadot/api";
import { xcmChainEndPoints } from "@/config/chainEndPoint";

export interface XcmChain {
  name: string;
  relayChain: string;
  img?: string;
  parachainId: number;
}

export interface ChainAsset extends AssetDetails {
  id: string;
  mappedERC20Addr: string;
  metadata: AssetMetadata;
  userBalance: string;
  userBalanceUsd: string;
  minBridgeAmount: string;
  originChain: string;
  originAssetId: string;
  tokenImage: string;
  isNativeToken: boolean;
  isXcmCompatible: boolean;
}

const kyotoChain: XcmChain = {
  name: "Kyoto",
  relayChain: "Kyoto",
  parachainId: 0,
};

const shibuyaChain: XcmChain = {
  name: "Shibuya",
  relayChain: "Kyoto",
  parachainId: 2000,
};

export const useBridge = () => {
  let originChainApi: RelaychainApi | null = null;
  const store = useStore();
  const amount = ref<string | null>(null);
  const currentAccount = computed<string>(
    () => store.getters["account/selectedAddress"]
  );
  const srcChain = ref<XcmChain>(kyotoChain);
  const destChain = ref<XcmChain>(shibuyaChain);
  const destParaId = ref<number>(shibuyaChain.parachainId);
  const isDisabledBridge = ref<boolean>(true);
  const isDeposit = ref<boolean>(true);
  const $api = computed<ApiPromise>(() => store.getters["account/currentApi"]);

  const substrateAccounts = computed(
    () => store.getters["account/substrateAccounts"]
  );

  const decimals = computed<string>(() => {
    const chainInfo = store.getters["account/chainInfo"];
    return chainInfo ? chainInfo.tokenDecimals : "18";
  });

  const assetId = "340282366920938463463374607431768211455";

  const initializeXcmApi = async (): Promise<void> => {
    try {
      await connectOriginChain();
      await originChainApi?.isReady;
    } catch (error) {
      console.error(error);
    }
  };

  const connectOriginChain = async (): Promise<void> => {
    const endpoint = xcmChainEndPoints[0].endpoint;

    try {
      originChainApi = new RelaychainApi(endpoint);
      await originChainApi.start();
    } catch (err) {
      console.error(err);
    }
  };

  const inputHandler = (event: any): void => {
    amount.value = event.target.value;
  };

  const getPubkeyFromSS58Addr = (ss58MappedAddr: string) => {
    const publicKey = decodeAddress(ss58MappedAddr);
    const hexPublicKey = u8aToHex(publicKey);
    return hexPublicKey;
  };

  const bridge = async (
    finalizedCallback: () => Promise<void>
  ): Promise<void> => {
    try {
      if (!currentAccount.value) {
        throw Error("Failed loading wallet address");
      }
      if (!srcChain.value || !destChain.value || !originChainApi) {
        throw Error("Something went wrong while bridging");
      }
      if (!amount.value) {
        throw Error("Invalid amount");
      }

      if (isDeposit.value) {
        let recipientAccountId = currentAccount.value;
        const injector = await getInjector(substrateAccounts.value);
        console.log("injector:", injector);

        const txCall = originChainApi.transferToParachain({
          toPara: destParaId.value,
          recipientAccountId: recipientAccountId,
          amount: ethers.utils
            .parseUnits(amount.value, decimals.value)
            .toString(),
        });
        console.log("=========start==========");

        await originChainApi
          .signAndSend({
            account: currentAccount.value,
            signer: injector.signer,
            tx: txCall,
            finalizedCallback,
            handleResult: undefined,
            tip: "1",
          })
          .catch((error: Error) => {
            // handleTransactionError(error);
            console.log("=========failed==========");
            console.log(error);
            isDisabledBridge.value = false;
            return;
          })
          .finally(async () => {
            isDisabledBridge.value = true;
            amount.value = null;
            console.log("=========success==========");
          });
      } else {
        // Withdrawal (native parachains -> relaychain)
        let recipientAccountId = getPubkeyFromSS58Addr(currentAccount.value);
        const injector = await getInjector(substrateAccounts.value);
        const parachainApi = new ParachainApi($api.value!!);

        // Todo: change to transferToOriginChain
        const txCall = await parachainApi.transferToOriginChain({
          assetId: assetId,
          recipientAccountId,
          amount: ethers.utils
            .parseUnits(amount.value, decimals.value)
            .toString(),
          isNativeToken: false,
          paraId: destChain.value.parachainId,
        });

        await parachainApi
          .signAndSend({
            account: currentAccount.value,
            signer: injector.signer,
            tx: txCall,
            finalizedCallback,
            handleResult: undefined,
            tip: "1",
          })
          .catch((error: Error) => {
            // handleTransactionError(error);
            console.log(error);
            isDisabledBridge.value = false;
          })
          .finally(async () => {
            isDisabledBridge.value = true;
            amount.value = null;
          });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  watchEffect(initializeXcmApi);

  return {
    bridge,
    inputHandler,
    amount,
  };
};
