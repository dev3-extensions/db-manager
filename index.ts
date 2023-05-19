import type { IDatabase } from "./structures/interfaces/database";
import { EmbeddedDB } from "./engines/IndexedDB/indexedDB";
import { TSource } from "./structures/types/source";
import { TSchemas } from "./structures/types/schemas";
import { TSchema } from "./structures/types/schema";
import { schemas as SchemasFile } from "../database-viewer/schemas.json";
import { TTable } from "./structures/types/table";
import * as fs from "fs";
// import { schemas as SchemasFile } from "../../../schemas.json";

export class Databases {
    databases: Array<IDatabase>;

    constructor() {
        this.databases = Array<IDatabase>();
    }

    async loadSchemas() {
        console.log(`schemas file: ${SchemasFile}`);
        for (var schema of SchemasFile) {
            switch (true) {
                case /IndexedDB/.test(schema.type): {
                    console.log("indexeddb found");
                    const newIDB = new EmbeddedDB(schema);
                    await newIDB.openDB();
                    this.databases.push(newIDB);
                }
            }
        }
    }

    // doesnt work on firefox AAAAAAAAAAAAA
    async getSchemas() {
        var idbs: IDBDatabaseInfo[] = await indexedDB.databases();
        var newSchemas: any = {};
        for (var idb of idbs) {
            console.log(`schemasfile ${JSON.stringify(SchemasFile)}`);
            console.log(idb);
            if (SchemasFile.some((schema) => schema.name == idb.name)) {
                console.log("db is already in schema");
            } else {
                var schemas = SchemasFile as Array<any>;
                console.log("db is not recorded in schema");
                var newSchema: {
                    name: string;
                    type: string;
                    version: number;
                    schema: Record<string, Record<string, string>>;
                } = {
                    name: idb.name || "",
                    type: "IndexedDB",
                    version: idb.version || 1,
                    schema: {},
                };
                newSchema.name = idb.name || "";
                newSchema.version = idb.version || 1;
                var idbconn = await indexedDB.open(
                    idb.name || "",
                    idb.version || 0
                );
                await new Promise((resolve, error) => {
                    idbconn.onsuccess = (e) => {
                        var idbd = idbconn.result;
                        var idbdtnames = idbd.objectStoreNames;
                        var tables: Record<string, Record<string, string>> = {};
                        for (var idbtn of idbdtnames) {
                            var columns: Record<string, string> = {};
                            console.log(idbtn);
                            var idbtr = idbd.transaction(idbtn, "readonly");
                            var idbt = idbtr.objectStore(idbtn);
                            var idbtins = idbt.indexNames;
                            console.log(idbtins);
                            for (var idbtin of idbtins) {
                                columns[idbtin] =
                                    idbt.index(idbtin).unique == true
                                        ? "UNIQUE"
                                        : "";
                            }
                            console.log(columns);
                            console.log(idbt.name);
                            tables[idbt.name] = columns;
                        }
                        newSchema.schema = tables;
                        resolve(e);
                    };
                    idbconn.onerror = (e) => {
                        error(e);
                    };
                });
                newSchema.type = "IndexedDB";
                console.log(`new schema ${JSON.stringify(newSchema)}`);
                schemas.push(newSchema);
                console.log(`schemas ${JSON.stringify(schemas)}`);
                console.log(schemas);
                newSchemas = schemas;
                // SchemasFile.push(newSchema);
            }
        }
        fs.writeFileSync("../database-viewer/schemas.json", newSchemas);
    }
}
