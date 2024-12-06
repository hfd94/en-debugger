<template>
  <v-list
    density="compact"
    style="margin-right: 1px; padding: 5px"
    :active="false"
    base-color="info"
  >
    <v-list-item
      v-for="(item, i) in Codes"
      :key="i"
      :value="item"
      class="v-list-item"
      rounded="xl"
      :active="false"
      @click="() => onInsertCodeToEditor(item.code)"
    >
      <v-list-item-title height="24" v-text="item.text"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { Codes } from "@/utils";
const emits = defineEmits(["insert"]);

const onInsertCodeToEditor = (code: string) => {
  emits("insert", code);
};
</script>

<style lang="scss" scoped>
.v-list-item {
  user-select: none;
  padding-left: 10px;
  min-height: 20px;
  :deep(.v-list-item-title) {
    font-size: 14px;
  }
  :deep(.v-list-item--active) {
    background-color: transparent !important; /* 去掉选中时的背景色 */
  }
}
</style>
