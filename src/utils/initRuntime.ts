import type { VOController } from "../../types/global"



export class ObjectValue implements VOController {
    private _objectPool: Map<string, any> = null!
    constructor() {
        this._objectPool = new Map()
    }

    get(key: string) {
        return this._objectPool.get(key)
    }

    set(key: string, val: any): void {
        this._objectPool.set(key, val)
    }

    remove(key: string) {
        this._objectPool.delete(key)
    }

    clear() {
        this._objectPool.clear()
    }
}

const InjectRuntime = () => {
    window.pm = {
        environment: new ObjectValue(),
        variables: new ObjectValue()
    }
}

export { InjectRuntime }