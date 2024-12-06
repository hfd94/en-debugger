<template>
  <v-btn @click="openWin"> Open Hex Editor </v-btn>
</template>

<script lang="ts" setup>
const openWin = () => {
  window.ipcRenderer.invoke("open-hex-editor", "hex-edit");
};
</script>
