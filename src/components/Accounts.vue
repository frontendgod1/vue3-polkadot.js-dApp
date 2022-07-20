<template>
  <div v-if="accounts.length > 0" class="account-list">
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Address</th>
          <th>Send</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ account.name }}</td>
          <td>{{ account.address }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import type { SubstrateAccount } from "../hooks/useConnectWallet";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();
    const accounts = computed<SubstrateAccount[]>(
      () => store.getters["account/substrateAccounts"]
    );

    return {
      accounts,
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
</style>
