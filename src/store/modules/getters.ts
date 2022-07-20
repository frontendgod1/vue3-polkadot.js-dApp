import type { GetterTree } from "vuex";
import type { RootState } from "../index";
import type { GeneralStateInterface as State, SubstrateAccount } from "./state";
import type { ApiPromise } from "@polkadot/api";
import type { ChainInfo } from "@/hooks/useChainInfo";

export interface GeneralGetters {
  chainInfo(state: State): ChainInfo | undefined;
  substrateAccounts(state: State): SubstrateAccount[];
  selectedAddress(state: State): string;
  networkStatus(state: State): string;
  currentWallet(state: State): string;
  currentApi(state: State): ApiPromise;
}

const getters: GetterTree<State, RootState> & GeneralGetters = {
  networkStatus: (state) => state.currentNetworkStatus,
  chainInfo: (state) => state.chainInfo,
  extensionCount: (state) => state.extensionCount,
  substrateAccounts: (state) => state.substrateAccounts,
  selectedAddress: (state: State) => {
    return state.currentAddress;
  },
  currentWallet: (state: State) => state.currentWallet,
  currentApi: (state: State) => state.api,
};

export default getters;
