export const Codes = [
    { text: "Http请求模板", code: "" },
    {
        text: "WSocket处理模板", code: `(function (exports: PM.WSock): PM.WSockHandler | void {

})`
    },
    { text: "获取环境变量", code: "    pm.environment.get('key')\n" },
    { text: "设置环境变量", code: "    pm.environment.set('key','value')\n" },
    { text: "获取全局变量", code: "    pm.environment.get('key')\n" },
    { text: "设置全局变量", code: "    pm.environment.set('key')\n" },
    { text: "创建Buffer", code: "    const buf = new ByteBuffer(val)\n" },
    { text: "获得Proto Root", code: "    const buf = exports.pbRoot('fileName')\n" },
    { text: "获得Proto Lookup", code: "    const lookup = exports.lookupType('fileName','msgName')\n" }
] 