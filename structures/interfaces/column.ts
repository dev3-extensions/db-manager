import { TColumn } from "../types/column";
import { IModifiers } from "./column modifers";

export class IColumn {
    name: string;
    type: string;
    size?: number;
    nullable: boolean;
    unique: boolean;
    primary_key: boolean;
    auto_increment: boolean;
    foreign_key?: { table: string; column: string };
    default_value?: any;

    constructor(name: string, modifiers: string) {
        this.name = name;
        const mod_defs = new IModifiers();

        if (mod_defs.primary_key.test(modifiers)) {
            const type_match = mod_defs.type.exec(modifiers);
            this.type = type_match?.groups?.type || "INTEGER";
            if (type_match?.groups?.size != null) {
                var size: string = type_match.groups.size;
                this.size = Number.parseInt(size.substring(1, size.length - 1));
            }
            this.nullable = false;
            this.unique = true;
            this.auto_increment = true;
        } else if (mod_defs.foreign_key.test(modifiers)) {
            const type_match = mod_defs.type.exec(modifiers);
            this.type = type_match?.groups?.type || "INTEGER";
            if (type_match?.groups?.size != null) {
                var size: string = type_match.groups.size;
                this.size = Number.parseInt(size.substring(1, size.length - 1));
            }
            this.nullable = false;
            this.unique = true;
            this.auto_increment = false;
        } else {
            const type_match = mod_defs.type.exec(modifiers);
            this.type = type_match?.groups?.type || "VARCHAR";
            if (type_match?.groups?.size != null) {
                var size: string = type_match.groups.size;
                this.size = Number.parseInt(size.substring(1, size.length - 1));
            }
            this.nullable = mod_defs.nullable.test(modifiers);
            this.unique = mod_defs.unique.test(modifiers);
            this.auto_increment = mod_defs.ai.test(modifiers);
            if (mod_defs.foreign_key.test(modifiers)) {
                const foreign_key_match = mod_defs.foreign_key.exec(modifiers);
                this.foreign_key = {
                    table: foreign_key_match?.groups?.table || "",
                    column: foreign_key_match?.groups?.column || "",
                };
            }
            if (mod_defs.default.test(modifiers)) {
                const default_match = mod_defs.default.exec(modifiers);
                this.default_value = default_match?.groups?.value;
            }
        }
    }
}
