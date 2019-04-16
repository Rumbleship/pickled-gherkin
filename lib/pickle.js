"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Function that parses a gherkin table and returns an array of objects
 * for each line. The first line defines the names of the attributes of the return
 * object. Uses class-transformer package for the transformation, so all of the decorators
 * and manipulations are avalaibletable
 * @param cls Class to return an instance for each row
 * @param gherkinTable gherkin style table.
 * @returns an array of objects of type cls
 */
function pickleOne(gherkinTable, cls, transform_options) {
    const retArray = [];
    picklePassthrough(gherkinTable, retArray, cls, transform_options);
    return retArray;
}
exports.pickleOne = pickleOne;
/**
 * Function that parses table and adds to the array passed in, but returns the unchanged gherkin
 * table
 * @param retArray Array to add the rows in
 * @param gherkinTable gherkin style table.
 * @param cls Class to return an instance of for each row
 * @param transform_options
 * @returns gherkinTable passed in
 */
function picklePassthrough(gherkinTable, retArray, cls, transform_options, validate) {
    const rows = gherkinTable.split(/[\r\n]+/);
    let headers = [];
    for (const row of rows) {
        let columns = row.split('|');
        if (columns.length === 1 && columns[0].trim().length === 0) {
            continue;
        }
        else {
            columns = columns.map((col, index, arr) => {
                return col.trim();
            });
            if (headers.length) {
                if (isMarkDownStyleHeaderDivider(columns)) {
                    continue;
                }
                else {
                    const plainObj = {};
                    for (const header of headers) {
                        plainObj[header] = columns.shift();
                    }
                    if (cls) {
                        const inst = class_transformer_1.plainToClass(cls, plainObj, transform_options);
                        if (validate) {
                            const errs = class_validator_1.validateSync(inst);
                            if (errs.length) {
                                throw errs;
                            }
                        }
                        retArray.push(inst);
                    }
                    else {
                        retArray.push(plainObj);
                    }
                }
            }
            else {
                headers = columns;
            }
        }
    }
    return gherkinTable;
}
exports.picklePassthrough = picklePassthrough;
function isMarkDownStyleHeaderDivider(plainObj) {
    return plainObj[0].startsWith('---');
}
/**
 * Takes a string with gherkin style tables embedded with the text using <Table: name .... >
 * tags, extracts the tables and creates arrays of objects from them.
 *
 * @param embeddedTables the string containing one or more embedded tables
 * @param targetPickles An array of ojects that define the output arrays @see PickleDef
 * @return the string embeddedTables is returned unaltered
 */
function pickle(embeddedTables, targetPickles) {
    // RE 1 - (<Table:)(.*)([\s](.*\|.*[\s])+\s+>)
    // Find the tables embedded between @Table(name) \n .... \n\n>
    const tableRE = /@Table[\s]*\((.*)\)[\s]*[\s]([\s\S]*?)^\s*$/gim;
    let matches;
    do {
        matches = tableRE.exec(embeddedTables);
        if (matches) {
            const foundPickle = targetPickles.find(aPickle => {
                // we know that mathces is not null at this point
                // so use a no-null assertion
                return matches[1].trim() === aPickle.table;
            });
            if (foundPickle) {
                picklePassthrough(matches[2], foundPickle.array, foundPickle.cls, foundPickle.transform_options, foundPickle.validate);
            }
            else {
                throw Error(`Table:${matches[1].trim()} has no definition`);
            }
        }
    } while (matches);
    return embeddedTables;
}
exports.pickle = pickle;
/**
 * Converts an array of Objects to a textual representation
 * @param pickles An Array of objects
 * @returns a gherkin text representation of the array of objects
 */
function fromPickles(pickles) {
    let gherkin = '';
    const headers = [];
    const column_widths = [];
    const table = [];
    if (pickles.length) {
        Reflect.ownKeys(pickles[0]).forEach(key => {
            headers.push(key.toString());
        });
        for (const pickled of pickles) {
            const row = [];
            Reflect.ownKeys(pickled).forEach(key => {
                row.push(Reflect.get(pickled, key).toString());
            });
            table.push(row);
        }
        // calculate the column_widths
        headers.forEach((header, col_index) => {
            let column_width = header.length;
            table.forEach((row, row_index) => {
                column_width = Math.max(row[col_index].length, column_width);
            });
            column_widths.push(column_width);
        });
        // print the headers
        gherkin = headers.reduce((accum, current, col) => {
            const col_header = accum + current.padEnd(column_widths[col]);
            return col_header + ' | ';
        }, ' ');
        gherkin = ' ' + gherkin.substring(0, gherkin.lastIndexOf(' | ')).trim() + '\n';
        // do each row..
        table.forEach(row => {
            gherkin += row.reduce((accum, current, col) => {
                return accum + current.padEnd(column_widths[col]) + ' | ';
            }, ' ');
            gherkin = ' ' + gherkin.substring(0, gherkin.lastIndexOf(' | ')).trim() + '\n';
        });
    }
    return gherkin;
}
exports.fromPickles = fromPickles;
//# sourceMappingURL=pickle.js.map