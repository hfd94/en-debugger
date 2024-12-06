<template>
  <div class="wsocket-top">
    <div class="action">
      <div class="title-overlay text-3">
        <v-badge color="error" dot v-if="!data.isConnected"></v-badge>
        <v-badge color="success" dot v-else></v-badge>
      </div>
      <v-text-field
        density="compact"
        variant="outlined"
        style="max-height: 40px"
        v-model="data.url"
        :disabled="data.isConnected"
      >
      </v-text-field>
      <v-btn-group
        style="margin-left: 10px"
        variant="outlined"
        divided
        color="secondary"
      >
        <v-btn
          height="40"
          min-width="90"
          variant="flat"
          border="sm"
          @click="data.Connected"
          v-if="!data.isConnected"
        >
          连接
        </v-btn>
        <v-btn
          height="40"
          min-width="90"
          variant="flat"
          border="sm"
          color="error"
          @click="data.Closed"
          v-else
        >
          断开
        </v-btn>

        <v-btn
          height="40"
          style="min-width: 20px; border-left: thin !important"
          border="sm"
          variant="flat"
        >
          保存
        </v-btn>
      </v-btn-group>
    </div>

    <!-- 分割线条 -->
    <v-divider style="margin: 10px 0px 0px 0px"></v-divider>

    <!-- 表头 -->
    <v-tabs
      density="compact"
      color="secondary"
      class="tab-root"
      height="32"
      translate="no"
      @update:model-value="onChange"
    >
      <v-tab value="message" class="tab-items" style="padding: 0 5px 0 5px">
        消息面板
      </v-tab>
      <v-tab value="script" class="tab-items" style="padding: 0 5px 0 5px">
        执行脚本
      </v-tab>
      <v-tab value="logger" class="tab-items" style="padding: 0 5px 0 5px">
        日志
      </v-tab>
    </v-tabs>
  </div>
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

const emits = defineEmits(["update:modelValue"]);
const onChange = (val: any) => {
  emits("update:modelValue", val);
};
</script>

<style lang="scss" scoped>
.wsocket-top {
  position: relative;
  height: 105px;
  padding-top: 10px;
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    width: 100%;
    left: 0px;
    height: 1px;
    background-color: rgba(var(--v-border-color), var(--v-border-opacity));
  }
}

.action {
  display: flex;
  padding: 0px 10px;
  height: 40px;
  :deep(.v-field) {
    border-radius: 0px 4px 4px 0px;
  }
}

.title-overlay {
  user-select: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  text-transform: uppercase;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid currentColor;
    border-right: thin;
    border-radius: 4px 0px 0px 4px;
    opacity: 0.38;
  }

  :deep(.v-badge--dot .v-badge__badge) {
    position: inherit;
    height: 10px;
    width: 10px;
    bottom: 0px !important;
    left: 0px !important;
    border-radius: 10px;

    // box-shadow: 2px 2px black;
    // bottom: 0!important;
  }
}
</style>
