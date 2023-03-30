import { Column } from "../../structures/column"
import { Table } from "../../structures/table"

export class IDBTable implements Table {
    name: string
    columns: Array<Column>
    store : IDBObjectStore
    
    constructor (db : IDBDatabase, name : string, table: JSON) {
        this.store = db.transaction(db.name).objectStore(this.name)
        this.name = name
        for(const name in table) {
            const mods = table[name]
            this.columns.push(
                new Column(name, mods)
            )
        }
    }
    add(data: JSON): void {
        this.store.add(data)
    }
    get(id: number) : JSON {
        const get_req = this.store.get(id)
        get_req.onsuccess = (e) => {
            return get_req.result
        }
        get_req.onerror = (e) => {
            return { "error" : e }
        }
        return JSON.parse('{ "error" : "request unsuccessful" }')
    }
    getAll(query?: string, count?: number): JSON {
        const get_req = this.store.getAll(query, count)
        get_req.onsuccess = (e) => {
            return get_req.result
        }
        get_req.onerror = (e) => {
            return { "error" : e }
        }
        return JSON.parse('{ "error" : "request unsuccessful" }')
    }
    update(id: number, data: JSON): JSON {
        const put_req = this.store.put(data, id)
        put_req.onsuccess = (e) => {
            return put_req.result
        }
        put_req.onerror = (e) => {
            return { "error" : e }
        }
        return JSON.parse('{ "error" : "request unsuccessful" }')
    }
    delete(id: number): void {
        this.store.delete(id)
    }
    deleteAll(id: IDBKeyRange): void {
        this.store.delete(id)
    }

}