<template>
  <div class="panel">
    <v-window
      v-model:model-value="activeTab.index"
      style="height: 100%; overflow: visible"
    >
      <!--fade-transition-->
      <v-window-item
        :transition="false"
        :reverse-transition="false"
        v-for="val in openTabs"
        :key="'debuger-panel-' + val.id"
        :value="val.id"
        style="height: 100%; position: relative"
      >
        <HttpDebugerView
          v-if="['get', 'post'].includes(val.type)"
          :key="'http-' + val.id"
          :data="val"
          :type="val.type"
        />
        <WSocket :key="'wsock-' + val.id" :uuid="val.id" v-else />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import HttpDebugerView from "./WebLayout/index.vue";
import WSocket from "./WScoketLayout/index.vue";
import { useCustomization } from "@/stores";

const { openTabs, activeTab } = useCustomization();
</script>

<style lang="scss" scoped>
.panel {
  //   padding-top: 10px;
  width: 100%;
  height: calc(100% - 33px);
  position: relative;
  :deep(.v-window__container) {
    display: block;
  }
  // .v-tabs {
  //   :deep(.v-tabs-slider-wrapper) {
  //     transition: none;
  //   }
  // }
}
</style>
