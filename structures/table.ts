import { Column } from "./column"

export class Table {
    name: string
    columns: Array<Column>

    constructor (name: string, columns: JSON) {
        this.name = name
        for(const name in columns) {
            const mods = columns[name]
            this.columns.push(
                new Column(name, mods)
            )
        }
    }
}