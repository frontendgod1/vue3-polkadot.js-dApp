import type { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import type { GeneralStateInterface } from "./modules/state";
import account from "./modules";

export interface RootState {
  general: GeneralStateInterface;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
  modules: {
    account,
  },
});

export function useStore() {
  return vuexUseStore(key);
}
