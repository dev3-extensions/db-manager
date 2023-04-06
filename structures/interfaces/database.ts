import { ITable } from "./table"

export interface IDatabase {
    name : string
    version : number
    tables: Array<ITable>
}
