import type { Database } from "../../structures/database"
import { IDBTable } from "./IDBTable"

export class EmbeddedDB implements Database {
    name: string
    version: number
    db : IDBDatabase
    tables: Array<IDBTable>
    constructor(schema : JSON) {
        this.name = schema["name"]
        this.version = schema["version"]
        this.open()
        for(const name in schema["schema"]) {
            const table = schema["schema"][name]
            this.tables.push(
                new IDBTable(this.db, name, table)
            )
        }
    }
    private open() : void {
        const open_db_req = indexedDB.open(this.name, this.version)
        open_db_req.onsuccess = (e) => {
            this.db = open_db_req.result
        }
        open_db_req.onerror = (e) => {
            console.error("open IDB error: ", e)
        }
        open_db_req.onupgradeneeded = (e) => {
            const db = open_db_req.result
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
}