import { Table } from "./table"

export interface Database {
    name : string
    version : number
    tables: Array<Table>
}
