<template>
  <div>
    <ConnectWallet />
    <div class="content">
      <Accounts />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import Accounts from "../components/Accounts.vue";

export default defineComponent({
  components: {
    Accounts,
    ConnectWallet,
  },
});
</script>

<style>
.content {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
