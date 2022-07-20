<template>
  <div v-if="accountBalanceMap.length > 0" class="account-list">
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Address</th>
          <th>Balance</th>
          <th>Send</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accountBalanceMap" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ account.name }}</td>
          <td>{{ account.address }}</td>
          <td>
            {{ formatBalance(account.balance, tokenDecimals) }}
            <span class="token-symbol">{{ nativeTokenSymbol }}</span>
          </td>
          <td>
            <img
              class="transfer-btn"
              src="@/assets/images/transfer.png"
              @click="selectAccount(account.address)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <TransferModal v-if="openModal" :close-modal="closeModal" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import type { SubstrateAccount } from "../hooks/useConnectWallet";
import { useStore } from "../store";
import { fetchNativeBalance, formatBalance } from "../hooks/useBalance";
import type { ApiPromise } from "@polkadot/api";
import TransferModal from "./TransferModal.vue";

export default defineComponent({
  components: {
    TransferModal,
  },
  setup() {
    const openModal = ref<boolean>();
    const accountBalanceMap = ref<SubstrateAccount[]>([]);
    const store = useStore();
    const accounts = computed<SubstrateAccount[]>(
      () => store.getters["account/substrateAccounts"]
    );

    const api = computed<ApiPromise>(() => store.getters["account/currentApi"]);

    const nativeTokenSymbol = computed<string>(() => {
      const chainInfo = store.getters["account/chainInfo"];
      return chainInfo ? chainInfo.tokenSymbol : "";
    });

    const tokenDecimals = computed<string>(() => {
      const chainInfo = store.getters["account/chainInfo"];
      return chainInfo ? chainInfo.tokenDecimals : "18";
    });

    const updateAccountMap = async (): Promise<void> => {
      const updatedAccountMap = await Promise.all(
        accounts.value.map(async (it) => {
          const balance = await fetchNativeBalance({
            api: api.value,
            address: it.address,
          });
          return { ...it, balance };
        })
      );
      accountBalanceMap.value = updatedAccountMap;
    };

    watch(
      [accounts],
      async () => {
        if (!accounts.value.length) return;
        try {
          await updateAccountMap();
        } catch (error) {
          console.error(error);
        } finally {
        }
      },
      { immediate: true }
    );

    function selectAccount(address: string) {
      store.commit("account/setCurrentAddress", address);
      openModal.value = true;
    }

    function closeModal() {
      openModal.value = false;
    }

    return {
      accountBalanceMap,
      formatBalance,
      nativeTokenSymbol,
      tokenDecimals,
      selectAccount,
      openModal,
      closeModal,
    };
  },
});
</script>

<style>
.account-list {
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  text-align: left;
}

th {
  border-bottom: 3px solid #eee;
}

th {
  padding: 10px 20px;
}

td {
  padding: 20px 20px;
}

tr {
  border-top: 1px solid #eee;
  cursor: pointer;
  transition: 0.5s;
}

tr:first-child {
  border: none;
}

tbody tr:hover {
  background: #f3d2aa77;
}

.token-symbol {
  text-transform: uppercase;
  margin-left: 5px;
}

.transfer-btn {
  transition: 0.2s;
}

.transfer-btn:hover {
  transform: scale(1.2);
}
</style>
