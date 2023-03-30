import type { Database } from "./structures/database";
import { EmbeddedDB } from "./engines/IndexedDB/indexedDB";

var schemas : { [key : string] : { [key : string] : any } }

async function loadSchemas(): Promise<any> {
    const response = await fetch('../../../schemas.json');
    const data = await response.json();
    return data;
}

loadSchemas().then((data) => {
    console.log(data);
    schemas = data.parse
});

export class Databases {
    databases : Array<Database>

    constructor () {
        var databases = new Array<Database>
        Object.keys(schemas).forEach(key => {
            switch(schemas[key]["type"]) {
                case "IndexedDB" : {
                    databases.push(new EmbeddedDB(schemas[key].parse))
                }
                default : {
                    throw new Error("only IndexedDB has been implemented so far")
                }
            }
        })
        this.databases = databases
    }
}