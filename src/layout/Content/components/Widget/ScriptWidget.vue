<template>
  <v-tabs-window-item
    key="script"
    value="script"
    style="height: 100%; position: relative"
  >
    <div class="code-left">
      <ScriptInsertWidget @insert="onInsertCodeToEditor" />
    </div>
    <v-divider
      vertical
      style="width: 1px; height: 100%; margin-left: 199px"
    ></v-divider>
    <div class="code-right">
      <slot name="header" v-if="hasHeaderSlot"></slot>
      <CodeEditor
        ref="codeEditor"
        language="typescript"
        @change="onChange"
        @complate="onComplate"
      />
    </div>
  </v-tabs-window-item>
</template>
<script setup lang="ts">
import CodeEditor from "@/components/CodingEdtior/index.vue";
import ScriptInsertWidget from "./ScriptInsertWidget.vue";
import { ref, useSlots } from "vue";
import * as monaco from "monaco-editor"; // 全部导入

const emits = defineEmits(["change", "complate"]);

const onComplate = (v: monaco.editor.IStandaloneCodeEditor) => {
  emits("complate", v);
};

const onChange = (v: string) => {
  emits("change", v);
};
const slots = useSlots();
const hasHeaderSlot = !!slots.header;

const codeEditor = ref<typeof CodeEditor>();
const onInsertCodeToEditor = (code: string) => {
  if (codeEditor.value) {
    codeEditor.value.applyCode(code);
  }
};

const setValue = () => {
  if (codeEditor.value) {
    return codeEditor.value.setValue();
  }
};

const GetString = () => {
  if (codeEditor.value) {
    return codeEditor.value.getCode();
  }
  return "";
};

defineExpose({
  GetString,
  setValue,
});
</script>
<style scoped lang="scss">
.code-left {
  width: 200px;
  height: 100%;
  overflow: auto;
  position: absolute;
  top: 0px;
  left: 0px;
  // border-right: 1px solid;
  // &::before {
  //   content: "";
  //   position: absolute;
  //   // background-color: currentColor;
  //   opacity: 0.38;
  //   right: 0px;
  //   height: 100%;
  //   border-right: 1px solid;
  //   border-color: currentColor;
  //   // bottom: 0;
  //   // width: 1px;
  // }
}
.code-right {
  left: 200px;
  right: 0px;
  top: 0;
  height: 100%;
  position: absolute;
}
</style>
