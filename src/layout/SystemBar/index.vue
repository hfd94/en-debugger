<template>
  <v-system-bar style="-webkit-app-region: drag; padding-right: 0" height="28">
    <div style="-webkit-app-region: no-drag" class="d-flex">
      <v-btn
        variant="text"
        size="small"
        rounded="0"
        :ripple="false"
        @click="onClick"
      >
        <v-icon>mdi-minus-thick</v-icon>
      </v-btn>
      <v-btn variant="text" size="small" :ripple="false" @click="onClick2">
        <v-icon>mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn variant="text" size="small" color="error" :ripple="false">
        <v-icon>mdi-close-box</v-icon>
      </v-btn>
    </div>
    <!-- 顶部控制栏 -->
  </v-system-bar>
</template>

<script setup lang="ts">
const onClick = async () => {
  // const ret = await ipcRenderer.insetWorkDir({ id: "123456", name: "你好" });
  // console.log(ret);
};

const onClick2 = async () => {
  const ret = await window.ipcRenderer.invoke("insetWorkDir", {
    id: "123456",
    name: "你好2",
  });
  console.log(ret);
};
</script>
