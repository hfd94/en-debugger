<template>
  <v-main
    style="
      --v-layout-right: 2px;
      padding-left: calc(var(--v-layout-left) - 2px);
    "
  >
    <Tabs />
  </v-main>
</template>

<script setup lang="ts">
import Tabs from "./Tabs/index.vue";
</script>
