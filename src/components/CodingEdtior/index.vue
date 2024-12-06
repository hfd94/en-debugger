<template>
  <div ref="editorContainer" class="editor" style="min-height: 100px"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, toRaw, nextTick, watch } from "vue";
import * as monaco from "monaco-editor"; // 全部导入
import { initMonacoTypes } from "./types/index";
import ThemeJson from "./theme.json";

const props = defineProps({
  value: String,
  language: String,
  readonly: Boolean,
});

const emit = defineEmits(["change", "complate"]);

const editorContainer = ref();
let editor: monaco.editor.IStandaloneCodeEditor = null!;

watch(
  () => props.value,
  (n, v) => {
    editor.setValue(n!);
  }
);

onMounted(() => {
  if (editor) {
    return;
  }
  setTimeout(() => {
    initMonacoTypes();

    monaco.editor.defineTheme("vs", ThemeJson as any);

    editor = monaco.editor.create(editorContainer.value, {
      value: props.value || "",
      language: props.language,
      minimap: {
        enabled: false, //是否显示侧边栏
      },
      wordWrap: "on",
      automaticLayout: true,
      colorDecorators: true, //颜色装饰器
      roundedSelection: true,
      readOnly: props.readonly, //是否开启已读功能
      theme: "vs", //主题
      fontSize: 12,
      lineDecorationsWidth: 10,
      hover: {
        enabled: true,
        delay: 100,
      },
      quickSuggestions: { other: true, comments: false, strings: true },
      suggestOnTriggerCharacters: true, // 自动触发建议

      // cursorSmoothCaretAnimation: "on",// 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置
    });

    emit("complate", editor);

    // 监听编辑器内容变化
    editor.onDidChangeModelContent(() => {
      // 触发父组件的 change 事件，通知编辑器内容变化
      //@ts-ignore
      emit("change", editor.getValue());
    });
  }, 0);
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  if (editor) {
    // 清理 editor 资源，避免内存泄漏

    const models = monaco.editor.getModels();
    models.forEach((model) => {
      model.dispose();
    });

    // 清理 Monaco 编辑器实例
    editor.dispose();
    editor = null!;
    // 清除 Web Worker 资源
    // const workers = monaco.editor.getWorkerService().getWorkers();
    // workers.forEach((worker) => {
    //   worker.terminate();
    // });
    // window.removeEventListener("resize", updateLayout);
  }
});

const applyCode = (code: string) => {
  if (!editor) {
    return;
  }
  const position = editor.getPosition();
  if (!position) {
    return;
  }

  const range = new monaco.Range(
    position.lineNumber,
    1,
    position.lineNumber,
    1
  );

  // Define the edit operation
  const editOperation = {
    range: range,
    text: code, // The text to be inserted
    forceMoveMarkers: true, // This is optional, depending on your needs
  };

  nextTick(() => {
    editor.executeEdits("", [editOperation]);
  });

  editor.focus();
};

const getCode = () => {
  return editor.getValue();
};
const setValue = (v: string) => {
  editor.setValue(v);
};

defineExpose({
  applyCode,
  getCode,
  setValue,
});
</script>

<style scoped lang="scss">
.editor {
  display: block;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
