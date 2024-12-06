export const byteBuffer = `
export declare class ByteBuffer {
    static BIG_ENDIAN: string;
    static LITTLE_ENDIAN: string;
    static _sysEndian: string;
    private _xd_;
    private _allocated_;
    private _pos_;
    private _length;
    private _u8d_;
    private _d_;
    constructor(data?: null);
    set offset(val: number);
    static getSystemEndian(): string;
    get buffer(): ArrayBuffer;
    get endian(): string;
    set endian(value: string);
    set length(value: number);
    get length(): number;
    private _resizeBuffer;
    /**
     * @private 常用于解析固定格式的字节流。先从字节流的当前字节偏移位置处读取一个Uint16值，然后以此值为长度，读取此长度的字符串。
     * @return 读取的字符串。
     */
    getString(): string;
    /**
     * @private 常用于解析固定格式的字节流。先从字节流的当前字节偏移位置处读取一个Uint16值，然后以此值为长度，读取此长度的字符串。
     * @return 读取的字符串。
     */
    readString(): string;
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Float32Array对象并返回此对象。注意：返回的Float32Array对象，在JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Float32Array对象。
     */
    getFloat32Array(start: number, len: number): Float32Array;
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Float32Array对象并返回此对象。注意：返回的Float32Array对象，在JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Float32Array对象。
     */
    readFloat32Array(start: number, len: number): Float32Array;
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Uint8Array对象并返回此对象。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Uint8Array对象。
     */
    getUint8Array(start: number, len: number): Uint8Array;
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Uint8Array对象并返回此对象。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Uint8Array对象。
     */
    readUint8Array(start: number, len: number): Uint8Array;
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Int16Array对象并返回此对象。注意：返回的 Int16Array 对象，在 JavaScript 环境下，是原生的 HTML5 Int16Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Int16Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始读取的字节偏移量位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的 Int16Array 对象。
     */
    getInt16Array(start: number, len: number): Int16Array;
    /**
     * 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Int16Array对象并返回此对象。
     * @param start 开始读取的字节偏移量位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的 Int16Array 对象。
     */
    readInt16Array(start: number, len: number): Int16Array;
    /**
     * @private 从字节流的当前字节偏移位置处读取一个IEEE 754单精度（32 位）浮点数。
     * @return 单精度（32 位）浮点数。
     */
    getFloat32(): number;
    /**
     * 从字节流的当前字节偏移位置处读取一个IEEE 754单精度（32 位）浮点数。
     * @return 单精度（32 位）浮点数。
     */
    readFloat32(): number;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个IEEE 754双精度（64 位）浮点数。
     * @return 双精度（64 位）浮点数。
     */
    getFloat64(): number;
    /**
     * 从字节流的当前字节偏移量位置处读取一个IEEE 754双精度（64 位）浮点数。
     * @return 双精度（64 位）浮点数。
     */
    readFloat64(): number;
    /**
     * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
     * @param value 单精度（32 位）浮点数。
     */
    writeFloat32(value: number): void;
    /**
     * 在字节流的当前字节偏移量位置处写入一个IEEE 754双精度（64位）浮点数。
     * @param value 双精度（64 位）浮点数。
     */
    writeFloat64(value: number): void;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Int32值。
     * @return Int32 值。
     */
    getInt32(): number;
    /**
     * 从字节流的当前字节偏移量位置处读取一个Int32值。
     * @return Int32 值。
     */
    readInt32(): number;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint32值。
     * @return Uint32值。
     */
    getUint32(): number;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint32值。
     * @return Uint32值。
     */
    readUint32(): number;
    /**
     * 在字节流的当前字节偏移量位置处写入指定的Int32值。
     * @param value 需要写入的 Int32 值。
     */
    writeInt32(value: number): void;
    /**
     * 在字节流的当前字节偏移量位置处写入Uint32值。
     * @param value 需要写入的 Uint32值。
     */
    writeUint32(value: number): void;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Int16值。
     * @return Int16 值。
     */
    getInt16(): number;
    /**
     * 从字节流的当前字节偏移量位置处读取一个Int16值。
     * @return Int16 值。
     */
    readInt16(): number;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint16值。
     * @return Uint16 值。
     */
    getUint16(): number;
    /**
     * 从字节流的当前字节偏移量位置处读取一个Uint16值。
     * @return Uint16 值。
     */
    readUint16(): number;
    /**
     * 在字节流的当前字节偏移量位置处写入指定的Uint16值。
     * @param value 需要写入的Uint16 值。
     */
    writeUint16(value: number): void;
    /**
     * 在字节流的当前字节偏移量位置处写入指定的Int16值。
     * @param value 需要写入的 Int16 值。
     */
    writeInt16(value: number): void;
    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint8值。
     * @return Uint8 值。
     */
    getUint8(): number;
    /**
     * 从字节流的当前字节偏移量位置处读取一个Uint8值。
     * @return Uint8 值。
     */
    readUint8(): number;
    /**
     * 在字节流的当前字节偏移量位置处写入指定的Uint8值。
     * @param value 需要写入的 Uint8 值。
     */
    writeUint8(value: number): void;
    private _getUInt8;
    private _readUInt8;
    private _getUint16;
    private _readUint16;
    private _rUTF;
    /**
     * @private 读取len参数指定的长度的字符串。
     * @param len 要读取的字符串的长度。
     * @return 指定长度的字符串。
     */
    getCustomString(len: number): string;
    /**
     * @private 读取len参数指定的长度的字符串。
     * @param len 要读取的字符串的长度。
     * @return 指定长度的字符串。
     */
    readCustomString(len: number): string;
    /**
     * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
     */
    get pos(): number;
    set pos(value: number);
    /**
     * 可从字节流的当前位置到末尾读取的数据的字节数。
     */
    get bytesAvailable(): number;
    /**
     * 清除字节数组的内容，并将length和pos属性重置为0。调用此方法将释放Byte实例占用的内存。
     */
    clear(): void;
    private __getBuffer;
    /**
     * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但writeUTFBytes()不使用 16 位长度的字为字符串添加前缀。
     * 对应的读取方法为： getUTFBytes 。
     * @param value 要写入的字符串。
     */
    writeUTFBytes(value: string): void;
    /**
     * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为16位整数），然后写入表示字符串字符的字节。
     * 对应的读取方法为： getUTFString 。
     * @param value 要写入的字符串值。
     */
    writeUTFString(value: string): void;
    /**
     * 将 UTF-8 字符串写入字节流。先写入以字节表示的UTF-8字符串长度（作为 32 位整数），然后写入表示字符串字符的字节。
     * @param value 要写入的字符串值。
     */
    writeUTFString32(value: string): void;
    /**
     * @private 读取 UTF-8 字符串。
     * @return 读取的字符串。
     */
    readUTFString(): string;
    readUTFString32(): string;
    /**
     * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。
     * 对应的写入方法为：writeUTFString。
     * @return 读取的字符串。
     */
    getUTFString(): string;
    /**
     * @private 读字符串，必须是 writeUTFBytes 方法写入的字符串。
     * @param len 要读的buffer长度，默认将读取缓冲区全部数据。
     * @return 读取的字符串。
     */
    readUTFBytes(len?: number): string;
    /**
     * 从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。
     * 一般读取的是由 writeUTFBytes 方法写入的字符串。
     * @param len 要读的buffer长度，默认将读取缓冲区全部数据。
     * @return 读取的字符串。
     */
    getUTFBytes(len?: number): string;
    /**
     * 在字节流中写入一个字节。
     * 使用参数的低 8 位。忽略高 24 位。
     * @param value
     */
    writeByte(value: number): void;
    /**
     * 从字节流中读取带符号的字节。
     * 返回值的范围是从 -128 到 127。
     * @return 介于 -128 和 127 之间的整数。
     */
    readByte(): number;
    /**
     * @private 从字节流中读取带符号的字节。
     */
    getByte(): number;
    private _ensureWrite;
    /**
     * 将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。
     * 如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。
     * 如果 offset 或 length 小于0，本函数将抛出异常。
     * @param arraybuffer 需要写入的 Arraybuffer 对象。
     * @param offset Arraybuffer 对象的索引的偏移量（以字节为单位）
     * @param length 从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
     */
    writeArrayBuffer(arraybuffer: ArrayBuffer, offset?: number, length?: number): void;
    /**
     * 读取ArrayBuffer数据
     * @param length
     * @return
     */
    readArrayBuffer(length: number): ArrayBuffer;
    readUint8Buffer(length: number): Uint8Array;
}

`