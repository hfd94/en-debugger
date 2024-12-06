<template>
  <v-list class="quick-message" density="compact" :active="false">
    <v-list-item
      v-for="(item, i) in data.quickCmds"
      :key="i"
      :value="item"
      class="v-list-item"
      :active="false"
      base-color="success"
    >
      <v-list-item-title
        height="20"
        @click="data.onResetCommandValue(item.command)"
      >
        <v-icon icon="mdi-function"></v-icon>
        {{ item.name }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useRunningStore } from "@/stores";
import { computed } from "vue";
const props = defineProps({
  uuid: { type: String, required: true },
});

const { openWScoket } = useRunningStore();

const data = computed(() => {
  return openWScoket[props.uuid];
});
</script>

<style lang="scss" scoped>
.quick-message {
  :deep(.v-list-item) {
    padding: 3px 0px 3px 5px;
  }
  :deep(.v-list-item--density-compact.v-list-item--one-line) {
    min-height: auto !important;
  }
  :deep(.v-list-item-title) {
    font-size: 14px;
    letter-spacing: 0;
  }
}
</style>
