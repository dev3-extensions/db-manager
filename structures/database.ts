import { Table } from "./table"

export interface Database {
    name : string
    version : number
    tables: Array<Table>
    add(data: JSON) : void
    get(id: BigInteger) : JSON
    delete(id: BigInteger) : Boolean
    update(id: BigInteger, data: JSON) : Boolean
}
