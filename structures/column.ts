import { Modifiers } from "./column modifers";

export class Column {
    name: string;
    type: string;
    size?: number;
    nullable: boolean;
    unique: boolean;
    primary_key: boolean;
    auto_increment: boolean;
    foreign_key?: { table: string, column: string };
    default_value?: any;

    constructor(name: string, mods: string) {
        this.name = name
        const mod_defs = new Modifiers()

        if (mod_defs.primary_key.test(mods)) {
            const type_match = mod_defs.type.exec(mods)
            this.type = type_match?.groups?.type || "INTEGER"
            if (type_match?.groups?.size != null) {
                var size : string = type_match.groups.size
                this.size = Number.parseInt(size.substring(1, size.length-1))
            }
            this.nullable = false
            this.unique = true
            this.auto_increment = true

        } else if (mod_defs.foreign_key.test(mods)) {
            const type_match = mod_defs.type.exec(mods)
            this.type = type_match?.groups?.type || "INTEGER"
            if (type_match?.groups?.size != null) {
                var size : string = type_match.groups.size
                this.size = Number.parseInt(size.substring(1, size.length-1))
            }
            this.nullable = false
            this.unique = true
            this.auto_increment = false

        } else {
            const type_match = mod_defs.type.exec(mods)
            this.type = type_match?.groups?.type || "VARCHAR"
            if (type_match?.groups?.size != null) {
                var size : string = type_match.groups.size
                this.size = Number.parseInt(size.substring(1, size.length-1))
            }
            this.nullable = mod_defs.nullable.test(mods)
            this.unique = mod_defs.unique.test(mods)
            this.auto_increment = mod_defs.ai.test(mods)
            if (mod_defs.foreign_key.test(mods)) {
                const foreign_key_match = mod_defs.foreign_key.exec(mods)
                this.foreign_key = {
                    "table" : foreign_key_match?.groups?.table || "",
                    "column" : foreign_key_match?.groups?.column || ""
                }
            }
            if (mod_defs.default.test(mods)) {
                const default_match = mod_defs.default.exec(mods)
                this.default_value = default_match?.groups?.value
            }
        }
    }
}