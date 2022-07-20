import { ref } from "vue";
import type { InjectedExtension } from "@polkadot/extension-inject/types";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { keyring } from "@polkadot/ui-keyring";
import type { ApiPromise } from "@polkadot/api";

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
  if (connected != null || forceRequest) {
    let extensions = await web3Enable("My Dapp");
    return extensions;
  }
  return [];
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
