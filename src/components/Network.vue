<template>
  <div class="network">
    <img class="network-logo" :src="logoImg" />
    {{ networkName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref, watchEffect } from "vue";

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
  setup(props) {
    const logoImg = ref();
    watchEffect(async () => {
      logoImg.value = (
        await import(`/src/assets/images/${props.logo}`)
      ).default;
    });

    return {
      logoImg,
    };
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
