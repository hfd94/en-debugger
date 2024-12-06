import { app } from "electron";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import { queryParam, insertParam, updateParam, deleteParam } from "./types";

const userDataPath = app.getPath("userData");
console.log(userDataPath)
const dbPath = path.join(userDataPath, "Storage.bin");

console.log("Database path:", dbPath);

class Database {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys = ON");
                console.log("Connected to the database.");
                resolve();
            });
        });
    }

    close(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Database closed.");
                    resolve();
                }
            });
        });
    }

    query(param: queryParam): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.db.all(param.sql, param.params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    insert(param: insertParam): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const keys = Object.keys(param.data);
            const values = Object.values(param.data);
            const placeholders = keys.map(() => "?").join(",");
            const sql = `INSERT INTO ${param.table} (${keys.join(
                ","
            )}) VALUES (${placeholders})`;

            this.db.run(sql, values, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    update(param: updateParam): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const entries = Object.entries(param.data)
                .map(([key, value]) => `${key} = ?`)
                .join(",");
            const params = Object.values(param.data);
            const sql = `UPDATE ${param.table} SET ${entries} WHERE ${param.condition}`;

            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    delete(param: deleteParam): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = `DELETE FROM ${param.table} WHERE ${param.condition}`;
            console.log(sql)

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const db = new Database();

export const initSqlite = async () => {
    try {
        await db.open();
        await db.query({
            sql: `
            CREATE TABLE IF NOT EXISTS work_menus ( id TEXT PRIMARY KEY, name TEXT NOT NULL, parentId TEXT, type TEXT );
            `
        })
        await db.query({
            sql: `CREATE TABLE IF NOT EXISTS work_panel ( id TEXT PRIMARY KEY, url TEXT NOT NULL, type TEXT,  script TEXT );`
        })
        await db.query({
            sql: `CREATE TABLE IF NOT EXISTS work_quick (id INTEGER PRIMARY KEY AUTOINCREMENT,parentId INTEGER,name TEXT,command TEXT)`
        })

        await db.query({
            sql: `INSERT INTO work_menus (id, name) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530882','测试存放');`
        })
        await db.query({
            sql: `INSERT INTO work_menus (id, name) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530881','演示二级目录');`
        })
        await db.query({
            sql: `INSERT INTO work_menus (id, name,parentId) VALUES ('1b85da56-5fb6-4d6f-b9b5-295db5530880','二级目录','1b85da56-5fb6-4d6f-b9b5-295db5530881');`
        })
        await db.query({
            sql: `INSERT INTO work_menus (id, name,parentId,type) VALUES ('1b85da56','WebSocket','1b85da56-5fb6-4d6f-b9b5-295db5530882','websocket');`
        })
        await db.query({
            sql: `INSERT INTO work_menus (id, name,parentId,type) VALUES ('1b85da51','Http-Get','1b85da56-5fb6-4d6f-b9b5-295db5530882','get');`
        })
        await db.query({ sql: `INSERT INTO work_panel (id, url,type) VALUES ('1b85da56','ws://127.0.0.1:3000','websocket');` })
        await db.query({ sql: `INSERT INTO work_panel (id, url,type) VALUES ('1b85da51','http://www.baidu.com','get');` })
        console.log("Database initialized.");
    } catch (err) {
        console.error("Error opening database:", err);
    }
};

export const sqQuery = db.query.bind(db);
export const sqInsert = db.insert.bind(db);
export const sqUpdate = db.update.bind(db);
export const sqDelete = db.delete.bind(db);