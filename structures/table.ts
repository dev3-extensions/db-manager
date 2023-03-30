import { Column } from "./column"

export interface Table {
    name: string
    columns: Array<Column>
    add(data:JSON) : void
    get(id:number) : JSON
    getAll(query? : string, count? : number) : JSON
    update(id:number, data:JSON) : void
    delete(id:number) : void
}