import { connectApi } from "../config/api/polkadot/connectApi";
import { keyring } from "@polkadot/ui-keyring";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { useStore } from "@/store";
import { useExtensions } from "./useExtensions";
import { xcmChainEndPoints, providerEndpoints } from "../config/chainEndPoint";
import type { Struct } from "@polkadot/types";
import { useChainInfo } from "./useChainInfo";
import { watchPostEffect } from "vue";

export type SubstrateAccount = {
  address: string;
  name: string;
  source: string;
  balance?: string;
};

interface Account extends Struct {
  balance: string;
}

export const useConnectWallet = () => {
  let $api: ApiPromise | undefined;
  const seen = new Set();
  const store = useStore();

  const objToArray = (obj: any): any[] => {
    const keys = Object.keys(obj);
    const array = keys.map((k) => obj[k]);
    return array;
  };

  let substrateAccounts: SubstrateAccount[] = [];

  keyring.accounts.subject.subscribe((accounts) => {
    if (accounts) {
      const accountArray = objToArray(accounts);
      accountArray.forEach((account) => {
        const { address, meta } = account.json;
        const source = meta.source;
        const addressWithSource = address + source;
        const isSeen = seen.has(addressWithSource);

        if (!isSeen) {
          const data = {
            address,
            name: meta.name.replace("\n              ", ""),
            source,
          };

          seen.add(addressWithSource);
          substrateAccounts.push(data);
          store.commit("account/setSubstrateAccounts", substrateAccounts);
        }
      });
    }
  });

  const connect = async (): Promise<void> => {
    const { api } = await connectApi(store, xcmChainEndPoints[0].endpoint);
    // $api = api;
    const { extensions } = useExtensions(api);
    const { chainInfo } = useChainInfo(api);

    store.commit("account/setApi", api);

    watchPostEffect(() => {
      store.commit("account/setChainInfo", chainInfo.value);
    });
  };

  const connectXCMApi = async () => {
    const endpoint = providerEndpoints[0].endpoint;
    const provider = new WsProvider(endpoint);
    const api = new ApiPromise({ provider });

    await api.isReady;
    return api;
  };

  return {
    connect,
    connectXCMApi,
  };
};
