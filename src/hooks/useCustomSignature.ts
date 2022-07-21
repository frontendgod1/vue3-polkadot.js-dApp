import type { ISubmittableResult, ITuple } from "@polkadot/types/types";
import { useStore } from "../store";
import { computed, ref } from "vue";
import type { EventRecord, DispatchError } from "@polkadot/types/interfaces";
import type { Dispatch } from "vuex";

export enum TxType {
  dappsStaking = "dappsStaking",
  requiredClaim = "requiredClaim",
}

export const hasExtrinsicFailedEvent = (
  events: EventRecord[],
  dispatch: Dispatch,
  setMessage?: Function
): boolean => {
  let result = false;
  events
    .filter(
      (record): boolean =>
        !!record.event && record.event.section !== "democracy"
    )
    .map(({ event: { data, method, section } }) => {
      // console.log('event', method, section, data);
      // if (section === 'utility' && method === 'BatchInterrupted') {
      //   console.log(data.toHuman());
      // }

      if (section === "system" && method === "ExtrinsicFailed") {
        const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
        let message = dispatchError.type.toString();

        if (dispatchError.isModule) {
          try {
            const mod = dispatchError.asModule;
            const error = dispatchError.registry.findMetaError(mod);

            message = `${error.section}.${error.name}`;
          } catch (error) {
            // swallow
            console.error(error);
          }
        } else if (dispatchError.isToken) {
          message = `${dispatchError.type}.${dispatchError.asToken.type}`;
        }

        if (setMessage) {
          setMessage(message);
        }

        console.log(`action: ${section}.${method} ${message}`);
        result = true;
      } else if (section === "utility" && method === "BatchInterrupted") {
        // TODO there should be a better way to extract error,
        // for some reason cast data as unknown as ITuple<[DispatchError]>; doesn't work
        const anyData = data as any;
        const error = anyData[1].registry.findMetaError(anyData[1].asModule);
        let message = `${error.section}.${error.name}`;
        console.log(`action: ${section}.${method} ${message}`);
        result = true;
      }
    });

  return result;
};

export function useCustomSignature({
  fn,
  txType,
}: {
  fn?: () => void;
  txType?: TxType;
}) {
  const customMsg = ref<string | null>(null);

  const store = useStore();
  const isCustomSig = computed(() => {
    const isEthWallet = store.getters["general/isEthWallet"];
    const isH160 = store.getters["general/isH160Formatted"];
    return isEthWallet && !isH160;
  });
  const senderAddress = computed(
    () => store.getters["general/selectedAddress"]
  );

  const handleTransactionError = (e: Error): void => {
    console.error(e);
    const message = e.message;
    // store.dispatch("general/showAlertMsg", {
    //   msg: t("toast.transactionFailed", { message }),
    //   alertType: "error",
    // });

    alert("error: " + message);
  };

  const handleResult = async (result: ISubmittableResult): Promise<boolean> => {
    try {
      return new Promise<boolean>(async (resolve) => {
        const status = result.status;
        if (status.isFinalized) {
          if (!hasExtrinsicFailedEvent(result.events, store.dispatch)) {
            fn && fn();
            const msg = customMsg.value ? customMsg.value : "completed";

            // store.dispatch("general/showAlertMsg", {
            //   msg,
            //   alertType: "success",
            // });

            alert("completed: " + msg);
            // showLoading(store.dispatch, false);

            customMsg.value = null;
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          // showLoading(store.dispatch, true);
        }

        if (txType) {
          // displayCustomMessage({
          //   txType,
          //   result,
          //   senderAddress: senderAddress.value,
          //   store,
          //   t,
          // });
        }
      });
    } catch (error: any) {
      handleTransactionError(error);
      // showLoading(store.dispatch, false);
      return false;
    }
  };

  return {
    isCustomSig,
    handleResult,
    handleTransactionError,
    customMsg,
  };
}
