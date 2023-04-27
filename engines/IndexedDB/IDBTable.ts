import { IColumn } from "../../structures/interfaces/column";
import { ITable } from "../../structures/interfaces/table";
import { TTable } from "../../structures/types/table";

export class IDBTable implements ITable {
    name: string;
    columns: Array<IColumn>;
    store: IDBObjectStore;

    constructor(name: string, table: TTable) {
        this.name = name;
        this.columns = Array<IColumn>();
        for (const col in table) {
            this.columns.push(new IColumn(col, table[col]));
        }
    }
    add(data: JSON): void {
        this.store.add(data);
    }
    get(id: number): JSON {
        const get_req = this.store.get(id);
        get_req.onsuccess = (e) => {
            return get_req.result;
        };
        get_req.onerror = (e) => {
            return { error: e };
        };
        return JSON.parse('{ "error" : "request unsuccessful" }');
    }
    getAll(query?: string, count?: number): JSON {
        const get_req = this.store.getAll(query, count);
        get_req.onsuccess = (e) => {
            return get_req.result;
        };
        get_req.onerror = (e) => {
            return { error: e };
        };
        return JSON.parse('{ "error" : "request unsuccessful" }');
    }
    update(id: number, data: JSON): JSON {
        const put_req = this.store.put(data, id);
        put_req.onsuccess = (e) => {
            return put_req.result;
        };
        put_req.onerror = (e) => {
            return { error: e };
        };
        return JSON.parse('{ "error" : "request unsuccessful" }');
    }
    delete(id: number): void {
        this.store.delete(id);
    }
    deleteAll(id: IDBKeyRange): void {
        this.store.delete(id);
    }
}
