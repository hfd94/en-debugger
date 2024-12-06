<template>
  <v-app id="hex-editor">
    <v-system-bar
      style="-webkit-app-region: drag; padding-right: 0"
      height="28"
    >
      <div style="-webkit-app-region: no-drag" class="d-flex">
        <v-btn
          variant="text"
          size="small"
          rounded="0"
          :ripple="false"
          @click="() => {}"
        >
          <v-icon>mdi-minus-thick</v-icon>
        </v-btn>

        <v-btn
          variant="text"
          size="small"
          color="error"
          :ripple="false"
          @click="onCloseClick"
        >
          <v-icon>mdi-close-box</v-icon>
        </v-btn>
      </div>
      <!-- 顶部控制栏 -->
    </v-system-bar>

    <v-main
      style="
        --v-layout-right: 2px;
        padding-left: calc(var(--v-layout-left) - 2px);
      "
    >
      <button hover-class="button-hover" @click="onCloseClick">123123</button>
      {{ text }}
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRunningStore } from "@/stores";
import { onMounted } from "vue";

const { text } = useRunningStore();
const onCloseClick = () => {
  window.ipcRenderer.send("window-close", "hex-editor");
};

onMounted(() => {
  window.ipcRenderer.on("data-from-main", (event, data) => {
    console.log(data);
  });
});
</script>
