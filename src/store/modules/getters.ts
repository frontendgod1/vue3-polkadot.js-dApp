import type { GetterTree } from "vuex";
import type { RootState } from "../index";
import type { GeneralStateInterface as State, SubstrateAccount } from "./state";
import type { ChainInfo } from "src/hooks/useChainInfo";

export interface GeneralGetters {
  chainInfo(state: State): ChainInfo;
  substrateAccounts(state: State): SubstrateAccount[];
  networkIdx(state: State): number;
  selectedAddress(state: State): string;
  networkStatus(state: State): string;
  currentWallet(state: State): string;
}

const getters: GetterTree<State, RootState> & GeneralGetters = {
  networkStatus: (state) => state.currentNetworkStatus,
  chainInfo: (state) => state.chainInfo,
  extensionCount: (state) => state.extensionCount,
  substrateAccounts: (state) => state.substrateAccounts,
  networkIdx: (state) => state.currentNetworkIdx,
  selectedAddress: (state: State) => {
    return state.currentAddress;
  },
  currentWallet: (state: State) => state.currentWallet,
};

export default getters;
