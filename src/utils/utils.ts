const isBrowser = typeof document !== 'undefined';


function isType(val: any, t: string) {
    return Object.prototype.toString.call(val) === `[object ${t}]`;
}


const hasClass = (element: Element, className: string) => {
    // 如果是浏览器环境
    if (isBrowser && element && element.className) {
        const classPattern = new RegExp(`(\\s|^)${className}(\\s|$)`);
        return classPattern.test(element.className);
    }

    // 非浏览器环境或没有有效的元素，返回 false
    return false;
};

const toggleClass = (addClass: boolean, className: string, targetElement: Element) => {
    // 如果不是浏览器环境，则不执行任何操作
    if (!isBrowser) return;

    // 默认使用 document.body 作为目标元素
    const element = targetElement || document.body;

    // 获取当前元素的 className
    const { className: currentClassName } = element;

    // 清除当前类名中的目标类名，并清理多余的空格
    const updatedClassName = currentClassName
        .replace(className, "")
        .trim()
        .split(/\s+/)
        .join(" ");

    // 如果 addClass 为 true，则添加目标类名；否则，移除目标类名
    element.className = addClass ? `${updatedClassName} ${className}` : updatedClassName;
};

const isBoolean = (val: any) => {
    return isType(val, "Boolean")
}









export {
    hasClass,
    toggleClass,
    isBoolean
}