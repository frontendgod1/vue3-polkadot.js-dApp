import type { ChainInfo } from "src/hooks/useChainInfo";
import type { MutationTree } from "vuex";
import type { GeneralStateInterface as State, SubstrateAccount } from "./state";
import type { ConnectionType } from "./state";

export interface GeneralMutations<S = State> {
  setChainInfo(state: S, type: ChainInfo): void;
  setSubstrateAccounts(state: S, type: SubstrateAccount[]): void;
  setCurrentNetworkIdx(state: S, networkIdx: number): void;
  setCurrentAddress(state: S, address: string): void;
  setCurrentWallet(state: S, wallet: string): void;
  setCurrentNetworkStatus(state: S, networkStatus: ConnectionType): void;
}

const mutation: MutationTree<State> & GeneralMutations = {
  setChainInfo(state, chainInfo) {
    state.chainInfo = chainInfo;
  },
  setExtensionCount(state, count) {
    state.extensionCount = count;
  },
  setSubstrateAccounts(state, accounts) {
    state.substrateAccounts = accounts;
  },
  setCurrentNetworkIdx(state, networkIdx) {
    state.currentNetworkIdx = networkIdx;
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
};

export default mutation;
