<template>
  <div class="divide-top">
    <div class="adderss">
      <div class="title-overlay text-3">
        <div class="title">
          <span class="text-success">{{ props.type }}</span>
        </div>
      </div>
      <v-text-field
        density="compact"
        variant="outlined"
        style="max-height: 40px"
        :model-value="props.url"
      >
      </v-text-field>
      <v-btn-group
        style="margin-left: 10px"
        variant="outlined"
        divided
        color="secondary"
      >
        <v-btn height="40" min-width="90" variant="flat" border="sm">
          发送
        </v-btn>
        <v-btn
          height="40"
          style="min-width: 20px; border-left: thin !important"
          border="sm"
          variant="flat"
        >
          <v-icon icon="mdi-chevron-down"> </v-icon>
        </v-btn>
      </v-btn-group>
    </div>
    <v-divider style="margin: 10px 0px 0px 0px"></v-divider>

    <v-tabs
      density="compact"
      :model-value="props.modelValue"
      color="secondary"
      class="tab-root"
      height="32"
      translate="no"
      @update:model-value="onChange"
    >
      <v-tab value="script" class="tab-items" style="padding: 0 5px 0 5px">
        脚本
      </v-tab>
      <v-tab value="result" class="tab-items" style="padding: 0 5px 0 5px">
        响应数据
      </v-tab>
    </v-tabs>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  url: String,
  type: String,
});

const emits = defineEmits(["update:modelValue"]);
const onChange = (val: any) => {
  emits("update:modelValue", val);
};
</script>
<style lang="scss" scoped>
.divide-top {
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

  :deep(.v-field) {
    border-radius: 0px 4px 4px 0px;
  }
  .adderss {
    display: flex;
    padding: 0px 10px;
    height: 40px;
  }

  .title-overlay {
    user-select: none;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 60px;
    text-transform: uppercase;
    position: relative;

    .title {
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
    }
  }

  .tab-root {
    :deep(.v-tab__slider) {
      height: 4px;
      border-radius: 4px 4px 0px 0px;
    }
  }

  .tab-items {
    :deep(+ .v-btn__content) {
      width: 150px;
      min-width: 150px;
    }

    :deep(.subtitle-1) {
      text-transform: none;
      padding-top: 2px;
      font-size: 12px;
      width: 103px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
