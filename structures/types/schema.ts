import { TTable } from "./table"

export type TSchema = {
    name : string
    type : string
    version : number
    schema : Array<TTable>
}