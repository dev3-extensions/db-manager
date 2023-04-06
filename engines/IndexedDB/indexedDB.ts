import type { IDatabase } from "../../structures/interfaces/database"
import { TColumn } from "../../structures/types/column"
import { TSchema } from "../../structures/types/schema"
import { IDBTable } from "./IDBTable"

export class EmbeddedDB implements IDatabase {
    name: string
    version: number
    db : IDBDatabase
    tables: Array<IDBTable>
    constructor(schema : TSchema) {
        
        this.name = schema.name
        this.version = schema.version

        const open_db_req = indexedDB.open(this.name, this.version)
        open_db_req.onsuccess = (e) => {
            this.db = open_db_req.result
            if (this.tables === undefined) {
                this.tables = new Array<IDBTable>()
                for (const i in schema.schema) {
                    this.tables.push(new IDBTable(i, schema.schema[i]))
                }
            }
        }

        open_db_req.onerror = (e) => {
            console.error("open IDB error: ", e)
        }

        open_db_req.onupgradeneeded = (e) => {
            console.log("upgrading database")
            const db = open_db_req.result
            this.tables = new Array<IDBTable>()
            for (const i in schema.schema) {
                const newTable = new IDBTable(i, schema.schema[i])
                if (db.objectStoreNames.contains(newTable.name)) {
                    db.deleteObjectStore(newTable.name)
                }
                if (newTable.columns.some(c => c.auto_increment)) {
                    newTable.store = db.createObjectStore(newTable.name, { autoIncrement: true })
                } else {
                    newTable.store = db.createObjectStore(newTable.name)
                }
        
                for(const i in newTable.columns) {
                    const col = newTable.columns[i]
                    console.log(col)
                    if (col.primary_key) {
                        newTable.store.createIndex(col.name,"PRIMARY_KEY", { unique: col.unique })
                    } else if (col.foreign_key != null) {
                        newTable.store.createIndex(col.name,`FOREIGN_KEY ${col.foreign_key.table}.${col.foreign_key.column}`, { unique: col.unique })
                    } else {
                        newTable.store.createIndex(col.name,col.name, { unique: col.unique })
                    }
                }
                this.tables.push(newTable)
            }
            this.db = db
        }
    }
}