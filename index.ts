import type { IDatabase } from "./structures/interfaces/database";
import { EmbeddedDB } from "./engines/IndexedDB/indexedDB";
import { TSource } from "./structures/types/source";
import { TSchemas } from "./structures/types/schemas";

export class Databases {
    databases : Array<IDatabase>

    constructor () {
        this.databases = Array<IDatabase>()
    }
    
    async loadSchemas(): Promise<any> {
        var promises : Promise<any>[] = []
        promises.push(fetch('../../../schemas.json').then(schemasFile => {
            promises.push(schemasFile.json().then(s => {
                const schemas : TSchemas = s
                schemas.schemas.forEach(schema => {
                    switch(true) {
                        case /IndexedDB/.test(schema.type) : {
                            const newIDB = new EmbeddedDB(schema)
                            console.log(`adding indexeddb`)
                            console.log(newIDB)
                            this.databases.push(newIDB)
                        }
                    }
                })
            }))
        }))
        await Promise.all(promises)
        return new Promise((resolve, reject) => {
            console.log("returning promise");
            resolve("promise complete");
          });
    }

    getSchemas(source : TSource) : Promise<IDBDatabase[]> {
        return new Promise(() => {
            indexedDB.databases
        })
    }
}