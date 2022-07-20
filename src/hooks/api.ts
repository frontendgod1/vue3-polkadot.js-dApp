import { connectApi } from "@/config/api/polkadot/connectApi";
import { xcmChainEndPoints } from "@/config/chainEndPoint";
import { useStore } from "@/store";
import type { ApiPromise } from "@polkadot/api";
import keyring from "@polkadot/ui-keyring";
import type { SubstrateAccount } from "./useConnectWallet";

let $api: ApiPromise | undefined;

export const connect = async () => {
  const seen = new Set();
  const store = useStore();
  console.log(store);

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

  const { api } = await connectApi(store, xcmChainEndPoints[0].endpoint);
  $api = api;
};

connect();

export { $api };
