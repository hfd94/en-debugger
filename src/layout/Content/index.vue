<template>
  <v-main
    style="
      --v-layout-right: 2px;
      padding-left: calc(var(--v-layout-left) - 2px);
    "
  >
    <Tabs />
    <DebugerPanel />
    <!-- <div class="panel">
      <ControllerHeader />
      <ControllerBottom />
    </div> -->
  </v-main>
</template>

<script setup lang="ts">
import Tabs from "./Tabs/index.vue";
import DebugerPanel from "@/layout/Content/components/DebugerLayout.vue";
</script>
