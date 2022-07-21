<template>
  <div class="modal">
    <div class="close" @click="closeModal">Close</div>
    <div class="chain">
      <span>FROM</span>
      <div class="chainName">{{ xcmChainEndPoints[0].chainName }}</div>
    </div>
    <div class="chain">
      <span>TO</span>
      <div class="chainName">{{ providerEndpoints[0].chainName }}</div>
    </div>
    <div class="chain">
      <input
        type="number"
        min="0"
        placeholder="0.00"
        :value="amount"
        @change="inputHandler"
      />
      <div class="balance">
        {{ formatBalance(tokenBalance, tokenDecimals) }}
        <span class="token-symbol">{{ nativeTokenSymbol }}</span>
      </div>
    </div>
    <button :disabled="!amount" @click="handleBridge" class="confirm-btn">
      Confirm
    </button>
  </div>
</template>

<script lang="ts">
import type { ApiPromise } from "@polkadot/api";
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { watch } from "vue";
import { providerEndpoints, xcmChainEndPoints } from "../config/chainEndPoint";
import {
  fetchBalance,
  fetchNativeBalance,
  formatBalance,
} from "../hooks/useBalance";
import { useConnectWallet } from "../hooks/useConnectWallet";
import { useStore } from "../store";
import { useBridge } from "../hooks/useBridge";

export default defineComponent({
  props: ["closeModal", "handleUpdateTokenBalance"],
  setup(props) {
    const { bridge, inputHandler, amount } = useBridge();

    let transferAmount = ref<string>();
    let tokenBalance = ref<string>("0");
    let destBalance = ref<string>();
    const store = useStore();
    const { connectXCMApi } = useConnectWallet();

    const api = computed<ApiPromise>(() => store.getters["account/currentApi"]);
    let destApi = ref<ApiPromise>();

    const currentAddress = computed<string>(
      () => store.getters["account/selectedAddress"]
    );

    const nativeTokenSymbol = computed<string>(() => {
      const chainInfo = store.getters["account/chainInfo"];
      return chainInfo ? chainInfo.tokenSymbol : "";
    });

    const tokenDecimals = computed<string>(() => {
      const chainInfo = store.getters["account/chainInfo"];
      return chainInfo ? chainInfo.tokenDecimals : "18";
    });

    const getNativeBalance = async (): Promise<void> => {
      const balance = await fetchNativeBalance({
        api: api.value,
        address: currentAddress.value,
      });

      tokenBalance.value = balance;
    };

    const getApi = async (): Promise<void> => {
      const api = await connectXCMApi();
      destApi.value = api;
      const balance = await fetchBalance(api, currentAddress.value);
      destBalance.value = balance || "0";
    };

    const handleBridge = async (): Promise<void> => {
      await bridge(props.closeModal);
      await props.handleUpdateTokenBalance();
    };

    watch(
      [currentAddress],
      async () => {
        if (!currentAddress.value) return;
        try {
          await getNativeBalance();
          await getApi();
        } catch (error) {
          console.error(error);
        } finally {
        }
      },
      { immediate: true }
    );

    return {
      tokenBalance,
      providerEndpoints,
      xcmChainEndPoints,
      nativeTokenSymbol,
      tokenDecimals,
      formatBalance,
      transferAmount,
      inputHandler,
      bridge,
      amount,
      destBalance,
      handleBridge,
    };
  },
});
</script>

<style>
.modal {
  position: fixed;
  max-width: 500px;
  width: 100%;
  z-index: 1000;
  background: #f7f7f8;
  box-shadow: 0 0 10px grey;
  padding: 40px 30px 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}

.chain {
  padding: 15px;
  background: white;
  margin-bottom: 20px;
  border-radius: 5px;
}

.chainName {
  font-size: 20px;
  font-weight: bold;
}

.balance {
  display: flex;
  justify-content: end;
}

input {
  width: 100%;
  height: 50px;
  padding: 20px 0;
  font-size: 25px;
  font-weight: bold;
  border: none;
  outline: none;
  text-align: right;
}

.confirm-btn {
  width: 100%;
  padding: 15px 25px;
  font-size: 20px;
  cursor: pointer;
  background-color: #ff8c00;
  color: white;
  font-weight: bold;
  border-radius: 50px;
  border: none;
  outline: none;
  transition: all 0.1s;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.close {
  position: absolute;
  right: 30px;
  top: 10px;
  font-weight: bold;
  cursor: pointer;
}
</style>
