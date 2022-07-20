import type { ChainInfo } from "@/hooks/useChainInfo";
import type { ApiPromise } from "@polkadot/api";
import type { MutationTree } from "vuex";
import type { GeneralStateInterface as State, SubstrateAccount } from "./state";
import type { ConnectionType } from "./state";

export interface GeneralMutations<S = State> {
  setChainInfo(state: S, type: ChainInfo): void;
  setSubstrateAccounts(state: S, type: SubstrateAccount[]): void;
  setCurrentAddress(state: S, address: string): void;
  setCurrentWallet(state: S, wallet: string): void;
  setCurrentNetworkStatus(state: S, networkStatus: ConnectionType): void;
  setApi(state: S, api: ApiPromise): void;
}

const mutation: MutationTree<State> & GeneralMutations = {
  setChainInfo(state, chainInfo) {
    console.log(chainInfo);
    state.chainInfo = chainInfo;
  },
  setExtensionCount(state, count) {
    state.extensionCount = count;
  },
  setSubstrateAccounts(state, accounts) {
    state.substrateAccounts = accounts;
  },
  setCurrentNetworkStatus(state, networkStatus) {
    state.currentNetworkStatus = networkStatus;
  },
  setCurrentAddress(state, address) {
    state.currentAddress = address;
  },
  setCurrentWallet(state, walle: string) {
    state.currentWallet = walle;
  },
  setApi(state, api) {
    state.api = api;
  },
};

export default mutation;
