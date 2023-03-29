export class Modifiers {
    private types : Array<string> = new Array(
        "VARCHAR",
        "CHAR",
        "TINYTEXT",
        "TEXT",
        "MEDIUMTEXT",
        "LONGTEXT",

        "VARBINARY",
        "BINARY",
        "TINYBLOB",
        "BLOB",
        "MEDIUMBLOB",
        "LONGBLOB",

        "UINTEGER",
        "UBINTEGER",
        "BINTEGER",
        "INTEGER",

        "UINT",
        "UBINT",
        "BINT",
        "INT",

        "UFLOAT",
        "UBFLOAT",
        "BFLOAT",
        "FLOAT",

        "UDOUBLE",
        "UBDOUBLE",
        "BDOUBLE",
        "DOUBLE",

        "UDECIMAL",
        "UBDECIMAL",
        "BDECIMAL",
        "DECIMAL",

        "UDEC",
        "UBDEC",
        "BDEC",
        "DEC",

        "BOOLEAN",
        "BOOL",

        "DATE",
        "DATETIME",
        "TIMESTAMP",
        "TIME",
        "YEAR"
    )
    type : RegExp
    nullable : RegExp = /\sNULLABLE\s/
    unique : RegExp = /\sUNIQUE\s/
    ai : RegExp = /\sAUTO_INCREMENT\s/
    default : RegExp = /\sDEFAULT\s(?<value>\'[\s\S]+?\'|\"[\s\S]+?\"|\d+|\d+\.\d+)\s/
    primary_key : RegExp = /\sPRIMARY_KEY\s/
    foreign_key : RegExp = /\sFOREIGN_KEY\s(?<table>[\w\d]+)\.(?<column>[\w\d]+)\s/
    constructor() {
        var type_regex = `^(?<type>${this.types.join("|")})(?<size>\(\d+\))?`
    }
}