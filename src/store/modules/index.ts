import type { Module } from "vuex";
import type { RootState } from "../index";
import state from "./state";
import type { GeneralStateInterface as State } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const generalModule: Module<State, RootState> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default generalModule;
