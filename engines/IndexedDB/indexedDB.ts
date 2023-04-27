import type { IDatabase } from "../../structures/interfaces/database";
import { TColumn } from "../../structures/types/column";
import { TSchema } from "../../structures/types/schema";
import { IDBTable } from "./IDBTable";

export class EmbeddedDB implements IDatabase {
    name: string;
    version: number;
    private schema: TSchema;
    db: IDBDatabase;
    tables: Array<IDBTable>;
    constructor(schema: any) {
        console.log(schema);
        this.name = schema.name;
        this.version = schema.version;
        this.schema = schema;
        this.tables = Array<IDBTable>();
    }

    async openDB() {
        const open_db_req = await indexedDB.open(this.name, this.version);
        await this.openDBPromise(open_db_req)
            .then(() => {
                console.log("promise complete");
            })
            .catch(() => {
                console.log("promise error");
            });
        console.log("tables created");
    }

    async openDBPromise(request): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("starting listener promise");
            request.onsuccess = (e) => {
                console.log("on success");
                this.db = request.result;
                if (this.tables.length == 0) {
                    this.tables = new Array<IDBTable>();
                    for (const i in this.schema.schema) {
                        this.tables.push(
                            new IDBTable(i, this.schema.schema[i])
                        );
                    }
                }
                console.log(this.tables);
                resolve();
            };

            request.onerror = (e) => {
                console.log("on error");
                console.error("open IDB error: ", e);
                reject();
            };

            request.onupgradeneeded = (e) => {
                console.log("upgrading database");
                const db = request.result;
                this.tables = new Array<IDBTable>();
                for (const i in this.schema.schema) {
                    const newTable = new IDBTable(i, this.schema.schema[i]);
                    if (db.objectStoreNames.contains(newTable.name)) {
                        db.deleteObjectStore(newTable.name);
                    }
                    if (newTable.columns.some((c) => c.auto_increment)) {
                        newTable.store = db.createObjectStore(newTable.name, {
                            autoIncrement: true,
                        });
                    } else {
                        newTable.store = db.createObjectStore(newTable.name);
                    }

                    for (const i in newTable.columns) {
                        const col = newTable.columns[i];
                        console.log(col);
                        if (col.primary_key) {
                            newTable.store.createIndex(
                                col.name,
                                "PRIMARY_KEY",
                                {
                                    unique: col.unique,
                                }
                            );
                        } else if (col.foreign_key != null) {
                            newTable.store.createIndex(
                                col.name,
                                `FOREIGN_KEY ${col.foreign_key.table}.${col.foreign_key.column}`,
                                { unique: col.unique }
                            );
                        } else {
                            newTable.store.createIndex(col.name, col.name, {
                                unique: col.unique,
                            });
                        }
                    }
                    this.tables.push(newTable);
                }
                this.db = db;
                resolve();
            };
        });
    }
}
