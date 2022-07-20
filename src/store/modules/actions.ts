import type { ActionTree } from "vuex";
import type { RootState } from "../index";
import type { GeneralStateInterface as State } from "./state";

const toastTimeout = 5000;

const actions: ActionTree<State, RootState> = {
  showAlertMsg({ commit }, { msg, alertType }) {
    commit("setShowAlertMsg", true);
    commit("setAlertMsg", msg);
    commit("setAlertType", alertType);
    setTimeout(() => {
      commit("setShowAlertMsg", false);
    }, toastTimeout);
  },

  setLoading({ commit }, { result }: { result: boolean }) {
    commit("setLoading", result);
  },
};

export default actions;
