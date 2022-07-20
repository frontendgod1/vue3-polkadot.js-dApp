<template>
  <div>
    <div class="wallet-connect">
      <div class="brand">
        <img class="logo" src="@/assets/images/logo.svg" />
        <h1 class="brand-name">Polkadot</h1>
      </div>
      <button
        v-if="networkStatus === 'offline'"
        @click="connect"
        class="wallet-connect-btn"
      >
        Connect
      </button>
      <button class="wallet-connect-btn" v-else>
        <template v-if="networkStatus === 'connecting'">
          <Spinner /> <span style="margin-left: 10px">Connecting</span>
        </template>
        <template v-if="networkStatus === 'connected'">
          <Network :networkName="currentNetworkName" :logo="currentLogo" />
        </template>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useConnectWallet } from "../hooks/useConnectWallet";
import Spinner from "../components/Spinner.vue";
import Network from "../components/Network.vue";
import { useStore } from "../store";
import { ref } from "vue";
import { providerEndpoints } from "../config/chainEndPoint";

export default defineComponent({
  components: {
    Spinner,
    Network,
  },
  setup() {
    const { connect } = useConnectWallet();
    const store = useStore();

    const networkStatus = computed(
      () => store.getters["account/networkStatus"]
    );

    const currentNetworkIdx = computed(
      () => store.getters["account/networkIdx"]
    );

    const currentNetworkName = ref<string>(
      providerEndpoints[currentNetworkIdx.value].displayName
    );
    const currentLogo = ref<string>(
      providerEndpoints[currentNetworkIdx.value].defaultLogo
    );

    return {
      connect,
      networkStatus,
      currentNetworkIdx,
      currentNetworkName,
      currentLogo,
    };
  },
});
</script>

<style>
.wallet-connect {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-name {
  margin-left: 15px;
  color: #ff8c00;
  font-weight: bold;
  font-style: italic;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.8);
}

.logo {
  width: 60px;
}

.wallet-connect-btn {
  padding: 15px 25px;
  font-size: 20px;
  cursor: pointer;
  background: white;
  color: #ff8c00;
  font-weight: bold;
  border-radius: 50px;
  border: none;
  outline: none;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.wallet-connect-btn:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.wallet-connect-btn:active {
  box-shadow: none;
  transform: scale(0.98);
}
</style>
