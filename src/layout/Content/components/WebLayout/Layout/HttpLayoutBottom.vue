<template>
  <div class="divide-foot">
    <v-tabs-window
      v-model="props.active"
      style="height: 100%; overflow: visible"
    >
      <ResposeWidget />
      <ScriptWidget />
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import ResposeWidget from "../Widget/ResposeWidget.vue";
import ScriptWidget from "../../Widget/ScriptWidget.vue";

const props = defineProps({
  active: String,
});
</script>

<style lang="scss" scoped>
.divide-foot {
  position: absolute;
  top: 94px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0px;
    width: 100%;
    height: 1px;
    background-color: currentColor;
    opacity: 0.38;
  }

  :deep(.v-window__container) {
    height: 100%;
  }
}
</style>
