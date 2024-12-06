export class ByteBuffer {
    static BIG_ENDIAN = "bigEndian";
    static LITTLE_ENDIAN = "littleEndian";
    static _sysEndian: string = "";

    //端序
    private _xd_: boolean = false
    private _allocated_: number = 0
    private _pos_: number = 0
    private _length: number = 0
    private _u8d_: Uint8Array = null!
    private _d_: DataView = null!

    constructor(data = null) {
        this._xd_ = true;
        this._allocated_ = 8;
        this._pos_ = 0;
        this._length = 0;
        if (data) {
            this._u8d_ = new Uint8Array(data);
            this._d_ = new DataView(this._u8d_.buffer);
            this._length = this._d_.byteLength;
        }
        else {
            this._resizeBuffer(this._allocated_);
        }
    }

    set offset(val: number) { this._pos_ = val }

    static getSystemEndian(): string {
        if (!ByteBuffer._sysEndian) {
            var buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            ByteBuffer._sysEndian = (new Int16Array(buffer))[0] === 256 ? ByteBuffer.LITTLE_ENDIAN : ByteBuffer.BIG_ENDIAN;
        }
        return ByteBuffer._sysEndian;
    }

    get buffer(): ArrayBuffer {
        var rstBuffer = this._d_.buffer;
        if (rstBuffer.byteLength === this._length)
            return rstBuffer;
        return rstBuffer.slice(0, this._length);
    }
    get endian(): string {
        return this._xd_ ? ByteBuffer.LITTLE_ENDIAN : ByteBuffer.BIG_ENDIAN;
    }

    set endian(value: string) {
        this._xd_ = (value === ByteBuffer.LITTLE_ENDIAN);
    }

    set length(value: number) {
        if (this._allocated_ < value)
            this._resizeBuffer(this._allocated_ = Math.floor(Math.max(value, this._allocated_ * 2)));
        else if (this._allocated_ > value)
            this._resizeBuffer(this._allocated_ = value);
        this._length = value;
    }

    get length(): number {
        return this._length;
    }

    private _resizeBuffer(len: number) {
        try {
            var newByteView = new Uint8Array(len);
            if (this._u8d_ != null) {
                if (this._u8d_.length <= len)
                    newByteView.set(this._u8d_);
                else
                    newByteView.set(this._u8d_.subarray(0, len));
            }
            this._u8d_ = newByteView;
            this._d_ = new DataView(newByteView.buffer);
        }
        catch (err) {
            throw "Invalid typed array length:" + len;
        }
    }
    /**
     * @private 常用于解析固定格式的字节流。先从字节流的当前字节偏移位置处读取一个Uint16值，然后以此值为长度，读取此长度的字符串。
     * @return 读取的字符串。
     */
    getString(): string {
        return this.readString();
    }
    /**
     * @private 常用于解析固定格式的字节流。先从字节流的当前字节偏移位置处读取一个Uint16值，然后以此值为长度，读取此长度的字符串。
     * @return 读取的字符串。
     */
    readString(): string {
        return this._rUTF(this.getUint16());
    }
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Float32Array对象并返回此对象。注意：返回的Float32Array对象，在JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Float32Array对象。
     */
    getFloat32Array(start: number, len: number): Float32Array {
        return this.readFloat32Array(start, len);
    }
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Float32Array对象并返回此对象。注意：返回的Float32Array对象，在JavaScript 环境下，是原生的 HTML5 Float32Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Float32Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Float32Array对象。
     */
    readFloat32Array(start: number, len: number): Float32Array {
        var end = start + len;
        end = (end > this._length) ? this._length : end;
        var v = new Float32Array(this._d_.buffer.slice(start, end));
        this._pos_ = end;
        return v;
    }
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Uint8Array对象并返回此对象。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Uint8Array对象。
     */
    getUint8Array(start: number, len: number): Uint8Array {
        return this.readUint8Array(start, len);
    }
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Uint8Array对象并返回此对象。
     * @param start 开始位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的Uint8Array对象。
     */
    readUint8Array(start: number, len: number): Uint8Array {
        var end = start + len;
        end = (end > this._length) ? this._length : end;
        var v = new Uint8Array(this._d_.buffer.slice(start, end));
        this._pos_ = end;
        return v;
    }
    /**
     * @private 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Int16Array对象并返回此对象。注意：返回的 Int16Array 对象，在 JavaScript 环境下，是原生的 HTML5 Int16Array 对象，对此对象的读取操作都是基于运行此程序的当前主机字节序，此顺序可能与实际数据的字节序不同，如果使用此对象进行读取，需要用户知晓实际数据的字节序和当前主机字节序，如果相同，可正常读取，否则需要用户对实际数据(Int16Array.buffer)包装一层 DataView ，使用 DataView 对象可按照指定的字节序进行读取。
     * @param start 开始读取的字节偏移量位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的 Int16Array 对象。
     */
    getInt16Array(start: number, len: number): Int16Array {
        return this.readInt16Array(start, len);
    }
    /**
     * 从字节流中start参数指定的位置开始，读取len参数指定的字节数的数据，用于创建一个Int16Array对象并返回此对象。
     * @param start 开始读取的字节偏移量位置。
     * @param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
     * @return 读取的 Int16Array 对象。
     */
    readInt16Array(start: number, len: number): Int16Array {
        var end = start + len;
        end = (end > this._length) ? this._length : end;
        var v = new Int16Array(this._d_.buffer.slice(start, end));
        this._pos_ = end;
        return v;
    }

    /**
     * @private 从字节流的当前字节偏移位置处读取一个IEEE 754单精度（32 位）浮点数。
     * @return 单精度（32 位）浮点数。
     */
    getFloat32(): number {
        return this.readFloat32();
    }

    /**
     * 从字节流的当前字节偏移位置处读取一个IEEE 754单精度（32 位）浮点数。
     * @return 单精度（32 位）浮点数。
     */
    readFloat32(): number {
        if (this._pos_ + 4 > this._length)
            throw "getFloat32 error - Out of bounds";
        var v = this._d_.getFloat32(this._pos_, this._xd_);
        this._pos_ += 4;
        return v;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个IEEE 754双精度（64 位）浮点数。
     * @return 双精度（64 位）浮点数。
     */
    getFloat64(): number {
        return this.readFloat64();
    }

    /**
     * 从字节流的当前字节偏移量位置处读取一个IEEE 754双精度（64 位）浮点数。
     * @return 双精度（64 位）浮点数。
     */
    readFloat64(): number {
        if (this._pos_ + 8 > this._length)
            throw "getFloat64 error - Out of bounds";
        var v = this._d_.getFloat64(this._pos_, this._xd_);
        this._pos_ += 8;
        return v;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入一个 IEEE 754 单精度（32 位）浮点数。
     * @param value 单精度（32 位）浮点数。
     */
    writeFloat32(value: number) {
        this._ensureWrite(this._pos_ + 4);
        this._d_.setFloat32(this._pos_, value, this._xd_);
        this._pos_ += 4;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入一个IEEE 754双精度（64位）浮点数。
     * @param value 双精度（64 位）浮点数。
     */
    writeFloat64(value: number) {
        this._ensureWrite(this._pos_ + 8);
        this._d_.setFloat64(this._pos_, value, this._xd_);
        this._pos_ += 8;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Int32值。
     * @return Int32 值。
     */
    getInt32(): number {
        return this.readInt32();
    }

    /**
     * 从字节流的当前字节偏移量位置处读取一个Int32值。
     * @return Int32 值。
     */
    readInt32(): number {
        if (this._pos_ + 4 > this._length)
            throw "getInt32 error - Out of bounds";
        var float = this._d_.getInt32(this._pos_, this._xd_);
        this._pos_ += 4;
        return float;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint32值。
     * @return Uint32值。
     */
    getUint32(): number {
        return this.readUint32();
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint32值。
     * @return Uint32值。
     */
    readUint32(): number {
        if (this._pos_ + 4 > this._length)
            throw "getUint32 error - Out of bounds";
        var v = this._d_.getUint32(this._pos_, this._xd_);
        this._pos_ += 4;
        return v;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入指定的Int32值。
     * @param value 需要写入的 Int32 值。
     */
    writeInt32(value: number) {
        this._ensureWrite(this._pos_ + 4);
        this._d_.setInt32(this._pos_, value, this._xd_);
        this._pos_ += 4;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入Uint32值。
     * @param value 需要写入的 Uint32值。
     */
    writeUint32(value: number) {
        this._ensureWrite(this._pos_ + 4);
        this._d_.setUint32(this._pos_, value, this._xd_);
        this._pos_ += 4;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Int16值。
     * @return Int16 值。
     */
    getInt16(): number {
        return this.readInt16();
    }

    /**
     * 从字节流的当前字节偏移量位置处读取一个Int16值。
     * @return Int16 值。
     */
    readInt16(): number {
        if (this._pos_ + 2 > this._length)
            throw "getInt16 error - Out of bounds";
        var us = this._d_.getInt16(this._pos_, this._xd_);
        this._pos_ += 2;
        return us;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint16值。
     * @return Uint16 值。
     */
    getUint16(): number {
        return this.readUint16();
    }

    /**
     * 从字节流的当前字节偏移量位置处读取一个Uint16值。
     * @return Uint16 值。
     */
    readUint16(): number {
        if (this._pos_ + 2 > this._length)
            throw "getUint16 error - Out of bounds";
        var us = this._d_.getUint16(this._pos_, this._xd_);
        this._pos_ += 2;
        return us;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入指定的Uint16值。
     * @param value 需要写入的Uint16 值。
     */
    writeUint16(value: number) {
        this._ensureWrite(this._pos_ + 2);
        this._d_.setUint16(this._pos_, value, this._xd_);
        this._pos_ += 2;
    }

    /**
     * 在字节流的当前字节偏移量位置处写入指定的Int16值。
     * @param value 需要写入的 Int16 值。
     */
    writeInt16(value: number) {
        this._ensureWrite(this._pos_ + 2);
        this._d_.setInt16(this._pos_, value, this._xd_);
        this._pos_ += 2;
    }

    /**
     * @private 从字节流的当前字节偏移量位置处读取一个Uint8值。
     * @return Uint8 值。
     */
    getUint8(): number {
        return this.readUint8();
    }

    /**
     * 从字节流的当前字节偏移量位置处读取一个Uint8值。
     * @return Uint8 值。
     */
    readUint8(): number {
        if (this._pos_ + 1 > this._length)
            throw "getUint8 error - Out of bounds";
        return this._u8d_[this._pos_++];
    }

    /**
     * 在字节流的当前字节偏移量位置处写入指定的Uint8值。
     * @param value 需要写入的 Uint8 值。
     */
    writeUint8(value: number) {
        this._ensureWrite(this._pos_ + 1);
        this._d_.setUint8(this._pos_, value);
        this._pos_++;
    }

    private _getUInt8(pos: number) {
        return this._readUInt8(pos);
    }

    private _readUInt8(pos: number) {
        return this._d_.getUint8(pos);
    }

    private _getUint16(pos: number) {
        return this._readUint16(pos);
    }

    private _readUint16(pos: number) {
        return this._d_.getUint16(pos, this._xd_);
    }

    private _rUTF(len: number) {
        var max = this._pos_ + len, c, c2, c3, f = String.fromCharCode;
        var u = this._u8d_;
        var strs = [];
        var n = 0;
        strs.length = 1000;
        while (this._pos_ < max) {
            c = u[this._pos_++];
            if (c < 0x80) {
                if (c != 0)
                    strs[n++] = f(c);
            }
            else if (c < 0xE0) {
                strs[n++] = f(((c & 0x3F) << 6) | (u[this._pos_++] & 0x7F));
            }
            else if (c < 0xF0) {
                c2 = u[this._pos_++];
                strs[n++] = f(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (u[this._pos_++] & 0x7F));
            }
            else {
                c2 = u[this._pos_++];
                c3 = u[this._pos_++];
                const _code = ((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 & 0x7F) << 6) | (u[this._pos_++] & 0x7F);
                if (_code >= 0x10000) {
                    const _offset = _code - 0x10000;
                    const _lead = 0xd800 | (_offset >> 10);
                    const _trail = 0xdc00 | (_offset & 0x3ff);
                    strs[n++] = f(_lead);
                    strs[n++] = f(_trail);
                }
                else {
                    strs[n++] = f(_code);
                }
            }
        }
        strs.length = n;
        return strs.join('');
    }

    /**
     * @private 读取len参数指定的长度的字符串。
     * @param len 要读取的字符串的长度。
     * @return 指定长度的字符串。
     */
    getCustomString(len: number): string {
        return this.readCustomString(len);
    }

    /**
     * @private 读取len参数指定的长度的字符串。
     * @param len 要读取的字符串的长度。
     * @return 指定长度的字符串。
     */
    readCustomString(len: number): string {
        var v = "", ulen = 0, c, c2, f = String.fromCharCode;
        var u = this._u8d_;
        while (len > 0) {
            c = u[this._pos_];
            if (c < 0x80) {
                v += f(c);
                this._pos_++;
                len--;
            }
            else {
                ulen = c - 0x80;
                this._pos_++;
                len -= ulen;
                while (ulen > 0) {
                    c = u[this._pos_++];
                    c2 = u[this._pos_++];
                    v += f((c2 << 8) | c);
                    ulen--;
                }
            }
        }
        return v;
    }

    /**
     * 移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
     */
    get pos(): number {
        return this._pos_;
    }

    set pos(value: number) {
        this._pos_ = value;
    }

    /**
     * 可从字节流的当前位置到末尾读取的数据的字节数。
     */
    get bytesAvailable(): number {
        return this._length - this._pos_;
    }

    /**
     * 清除字节数组的内容，并将length和pos属性重置为0。调用此方法将释放Byte实例占用的内存。
     */
    clear() {
        this._pos_ = 0;
        this.length = 0;
        if (this._u8d_) { this._u8d_.fill(0) }
    }

    private __getBuffer(): ArrayBuffer {
        return this._d_.buffer;
    }

    /**
     * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但writeUTFBytes()不使用 16 位长度的字为字符串添加前缀。
     * 对应的读取方法为： getUTFBytes 。
     * @param value 要写入的字符串。
     */
    writeUTFBytes(value: string) {
        value = value + "";
        for (var i = 0, sz = value.length; i < sz; i++) {
            var c = value.charCodeAt(i);
            if (c <= 0x7F) {
                this.writeByte(c);
            }
            else if (c <= 0x7FF) {
                this._ensureWrite(this._pos_ + 2);
                this._u8d_.set([0xC0 | (c >> 6), 0x80 | (c & 0x3F)], this._pos_);
                this._pos_ += 2;
            }
            else if (c >= 0xD800 && c <= 0xDBFF) {
                i++;
                const c2 = value.charCodeAt(i);
                if (!Number.isNaN(c2) && c2 >= 0xDC00 && c2 <= 0xDFFF) {
                    const _p1 = (c & 0x3FF) + 0x40;
                    const _p2 = c2 & 0x3FF;
                    const _b1 = 0xF0 | ((_p1 >> 8) & 0x3F);
                    const _b2 = 0x80 | ((_p1 >> 2) & 0x3F);
                    const _b3 = 0x80 | ((_p1 & 0x3) << 4) | ((_p2 >> 6) & 0xF);
                    const _b4 = 0x80 | (_p2 & 0x3F);
                    this._ensureWrite(this._pos_ + 4);
                    this._u8d_.set([_b1, _b2, _b3, _b4], this._pos_);
                    this._pos_ += 4;
                }
            }
            else if (c <= 0xFFFF) {
                this._ensureWrite(this._pos_ + 3);
                this._u8d_.set([0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos_);
                this._pos_ += 3;
            }
            else {
                this._ensureWrite(this._pos_ + 4);
                this._u8d_.set([0xF0 | (c >> 18), 0x80 | ((c >> 12) & 0x3F), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos_);
                this._pos_ += 4;
            }
        }
    }

    /**
     * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为16位整数），然后写入表示字符串字符的字节。
     * 对应的读取方法为： getUTFString 。
     * @param value 要写入的字符串值。
     */
    writeUTFString(value: string) {
        var tPos = this.pos;
        this.writeUint16(1);
        this.writeUTFBytes(value);
        var dPos = this.pos - tPos - 2;
        this._d_.setUint16(tPos, dPos, this._xd_);
    }

    /**
     * 将 UTF-8 字符串写入字节流。先写入以字节表示的UTF-8字符串长度（作为 32 位整数），然后写入表示字符串字符的字节。
     * @param value 要写入的字符串值。
     */
    writeUTFString32(value: string) {
        var tPos = this.pos;
        this.writeUint32(1);
        this.writeUTFBytes(value);
        var dPos = this.pos - tPos - 4;
        this._d_.setUint32(tPos, dPos, this._xd_);
    }

    /**
     * @private 读取 UTF-8 字符串。
     * @return 读取的字符串。
     */
    readUTFString(): string {
        return this.readUTFBytes(this.getUint16());
    }

    readUTFString32(): string {
        return this.readUTFBytes(this.getUint32());
    }

    /**
     * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是一个无符号的短整型（以此字节表示要读取的长度）。
     * 对应的写入方法为：writeUTFString。
     * @return 读取的字符串。
     */
    getUTFString(): string {
        return this.readUTFString();
    }

    /**
     * @private 读字符串，必须是 writeUTFBytes 方法写入的字符串。
     * @param len 要读的buffer长度，默认将读取缓冲区全部数据。
     * @return 读取的字符串。
     */
    readUTFBytes(len: number = -1): string {
        if (len === 0)
            return "";
        var lastBytes = this.bytesAvailable;
        if (len > lastBytes)
            throw "readUTFBytes error - Out of bounds";
        len = len > 0 ? len : lastBytes;
        return this._rUTF(len);
    }

    /**
     * 从字节流中读取一个由 length 参数指定的长度的 UTF-8 字节序列，并返回一个字符串。
     * 一般读取的是由 writeUTFBytes 方法写入的字符串。
     * @param len 要读的buffer长度，默认将读取缓冲区全部数据。
     * @return 读取的字符串。
     */
    getUTFBytes(len: number = -1) {
        return this.readUTFBytes(len);
    }

    /**
     * 在字节流中写入一个字节。
     * 使用参数的低 8 位。忽略高 24 位。
     * @param value 
     */
    writeByte(value: number) {
        this._ensureWrite(this._pos_ + 1);
        this._d_.setInt8(this._pos_, value);
        this._pos_ += 1;
    }

    /**
     * 从字节流中读取带符号的字节。
     * 返回值的范围是从 -128 到 127。
     * @return 介于 -128 和 127 之间的整数。
     */
    readByte(): number {
        if (this._pos_ + 1 > this._length)
            throw "readByte error - Out of bounds";
        return this._d_.getInt8(this._pos_++);
    }

    /**
     * @private 从字节流中读取带符号的字节。
     */
    getByte(): number {
        return this.readByte();
    }

    private _ensureWrite(lengthToEnsure: number) {
        if (this._length < lengthToEnsure)
            this._length = lengthToEnsure;
        if (this._allocated_ < lengthToEnsure)
            this.length = lengthToEnsure;
    }


    /**
     * 将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。
     * 如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。
     * 如果 offset 或 length 小于0，本函数将抛出异常。
     * @param arraybuffer 需要写入的 Arraybuffer 对象。
     * @param offset Arraybuffer 对象的索引的偏移量（以字节为单位）
     * @param length 从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
     */
    writeArrayBuffer(arraybuffer: ArrayBuffer, offset = 0, length = 0) {
        if (offset < 0 || length < 0)
            throw "writeArrayBuffer error - Out of bounds";
        if (length == 0)
            length = arraybuffer.byteLength - offset;
        this._ensureWrite(this._pos_ + length);
        var uint8array = new Uint8Array(arraybuffer);
        this._u8d_.set(uint8array.subarray(offset, offset + length), this._pos_);
        this._pos_ += length;
    }

    /**
     * 读取ArrayBuffer数据
     * @param length 
     * @return 
     */
    readArrayBuffer(length: number): ArrayBuffer {
        var rst;
        rst = this._u8d_.buffer.slice(this._pos_, this._pos_ + length);
        this._pos_ = this._pos_ + length;
        return rst;
    }

    readUint8Buffer(length: number): Uint8Array {
        let a = this.readArrayBuffer(length)
        return new Uint8Array(a)
    }
}