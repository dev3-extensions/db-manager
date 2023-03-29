import { Database } from "../../structures/database"
import { Table } from "../../structures/table"

class EmbeddedDB implements Database {
    name: string
    version: number
    db : IDBDatabase
    tables: Table[]
    constructor(schema : JSON) {
        this.name = schema["name"]
        this.version = schema["version"]

        for(const name in schema["schema"]) {
            const table = schema["schema"][name]
            this.tables.push(
                new Table(name, table)
            )
        }
        this.open()
    }
    private open() : void {
        const open_db_req = indexedDB.open(this.name, this.version)
        open_db_req.onsuccess = (e) => {
            const ev = e as unknown as Event & { target: { result: IDBDatabase } };
            this.db = ev.target.result
        }
        open_db_req.onerror = (e) => {
            console.error("open IDB error: ", e)
        }
        open_db_req.onupgradeneeded = (e) => {
            const ev = e as unknown as Event & { target: { result: IDBDatabase } };
            const db = ev.target.result
            this.tables.forEach(function (table) {
                var store : IDBObjectStore
                if (table.columns.some(c => c.auto_increment)) {
                    store = db.createObjectStore(table.name, { autoIncrement: true })
                } else {
                    store = db.createObjectStore(table.name)
                }
                table.columns.forEach(function (column) {
                    store.createIndex(column.name, column.name, { unique: column.unique })
                })
            })
            this.db = db
        }
    }
    add(data: JSON): void {
        throw new Error("Method not implemented.")
    }
    get(id: Uint8Array): JSON {
        throw new Error("Method not implemented.")
    }
    delete(id: Uint8Array): Boolean {
        throw new Error("Method not implemented.")
    }
    update(id: Uint8Array, data: JSON): Boolean {
        throw new Error("Method not implemented.")
    }
}