import { computed, ref } from "vue";
import type { InjectedExtension } from "@polkadot/extension-inject/types";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { keyring } from "@polkadot/ui-keyring";
import type { ApiPromise } from "@polkadot/api";
import type { SubstrateAccount } from "./useConnectWallet";
import { store } from "@/store";

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

const getInjectedExtensions = async (forceRequest = false): Promise<any[]> => {
  const connected = localStorage.getItem("connected");
  console.log(forceRequest, connected);
  if (connected != null || forceRequest) {
    let extensions = await web3Enable("My Dapp");
    return extensions;
  }
  return [];
};

export const getSelectedAccount = (
  accounts: SubstrateAccount[]
): SubstrateAccount | undefined => {
  try {
    const selectedAddress = computed(
      () => store.getters["account/selectedAddress"]
    );

    const account = accounts.find((it) => it.address === selectedAddress.value);
    return account;
  } catch (error: any) {
    console.error(error.message);
    return undefined;
  }
};

export const getInjector = async (accounts: SubstrateAccount[]) => {
  const account = getSelectedAccount(accounts);
  const extensions = await getInjectedExtensions();
  console.log(account, extensions);
  const injector = extensions.find((it) => it.name === account?.source);
  return injector;
};

const loadAccounts = async () => {
  await cryptoWaitReady();
  const [injectedAccounts] = await Promise.all([
    web3Accounts().then((accounts): InjectedAccountExt[] =>
      accounts.map(
        ({ address, meta }, whenCreated): InjectedAccountExt => ({
          address,
          meta: {
            ...meta,
            name: `${meta.name} (
              ${meta.source === "polkadot-js" ? "extension" : meta.source})`,
            whenCreated,
          },
        })
      )
    ),
  ]);

  return {
    injectedAccounts,
  };
};

export function useExtensions(api: ApiPromise) {
  let extensions = ref<InjectedExtension[]>();

  (async () => {
    try {
      const injectedPromise = await getInjectedExtensions(true);
      extensions.value = await injectedPromise;

      const selectedAddress = localStorage.getItem("connected");
      if (!selectedAddress) {
        await loadAccounts();
      }
      const { injectedAccounts } = await loadAccounts();

      keyring.loadAll(
        {
          genesisHash: api.genesisHash,
          ss58Format: 5,
        },
        injectedAccounts
      );
    } catch (err) {
      console.error(err);
    }
  })();

  return {
    extensions,
  };
}
