<template>
  <router-view />
  <v-overlay class="overlay" v-model="isLoading" absolute>
    <v-progress-circular indeterminate color="primary" :size="80" :width="9" />
    <span style="margin-top: 20px">加载中。。。</span>
  </v-overlay>
</template>

<script setup lang="ts">
import { useApplication } from "./stores/application";

const { isLoading } = useApplication();
</script>

<style lang="scss" scoped>
.overlay {
  :deep(.v-overlay__scrim) {
    opacity: 0.001;
  }

  :deep(.v-overlay__content) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
