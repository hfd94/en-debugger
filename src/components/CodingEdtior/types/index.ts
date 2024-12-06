import { global } from "./global"


import * as monaco from "monaco-editor"; // 全部导入

export function initMonacoTypes() {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(global, "global.d.ts")
}