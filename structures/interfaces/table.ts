import { IColumn } from "./column"

export interface ITable {
    name: string
    columns: Array<IColumn>
    add(data:JSON) : void
    get(id:number) : JSON
    getAll(query? : string, count? : number) : JSON
    update(id:number, data:JSON) : void
    delete(id:number) : void
}