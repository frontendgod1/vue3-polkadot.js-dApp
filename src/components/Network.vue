<template>
  <div class="network">
    <img class="network-logo" :src="logo" />
    {{ networkName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    networkName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
});
</script>

<style>
.network {
  display: flex;
  align-items: center;
}

.network-logo {
  width: 25px;
  margin-right: 10px;
}
</style>
