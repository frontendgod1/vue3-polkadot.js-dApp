import { connectApi } from "../config/api/polkadot/connectApi";
import { keyring } from "@polkadot/ui-keyring";
import type { ApiPromise } from "@polkadot/api";
import { useStore } from "@/store";
import { useExtensions } from "./useExtensions";

export type SubstrateAccount = {
  address: string;
  name: string;
  source: string;
  balance?: string;
};

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
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
          console.log(data);
          store.commit("account/setSubstrateAccounts", substrateAccounts);
        }
      });
    }
  });

  const connect = async (): Promise<void> => {
    const { api } = await connectApi(store);
    $api = api;
    const { extensions } = useExtensions($api);
  };

  return {
    connect,
  };
};
