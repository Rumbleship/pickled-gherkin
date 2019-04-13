import 'reflect-metadata';
import { ClassTransformOptions } from 'class-transformer';
declare type ClassType<T> = new (...args: any[]) => T;
/**
 * Function that parses a gherkin table and returns an array of objects
 * for each line. The first line defines the names of the attributes of the return
 * object. Uses class-transformer package for the transformation, so all of the decorators
 * and manipulations are avalaibletable
 * @param cls Class to return an instance for each row
 * @param gherkinTable gherkin style table.
 * @returns an array of objects of type cls
 */
export declare function pickleOne<T>(gherkinTable: string, cls?: ClassType<T>, transform_options?: ClassTransformOptions): T[];
/**
 * Function that parses table and adds to the array passed in, but returns the unchanged gherkin
 * table
 * @param retArray Array to add the rows in
 * @param gherkinTable gherkin style table.
 * @param cls Class to return an instance of for each row
 * @param transform_options
 * @returns gherkinTable passed in
 */
export declare function picklePassthrough<T>(gherkinTable: string, retArray: T[], cls?: ClassType<T>, transform_options?: ClassTransformOptions, validate?: boolean): string;
/**
 * Interface for defining the output arrays for the pcikle functions
 */
export interface PickleDef<T> {
    table: string;
    array: T[];
    cls?: ClassType<T>;
    transform_options?: ClassTransformOptions;
    validate?: boolean;
}
/**
 * Takes a string with gherkin style tables embedded with the text using <Table: name .... >
 * tags, extracts the tables and creates arrays of objects from them.
 *
 * @param embeddedTables the string containing one or more embedded tables
 * @param targetPickles An array of ojects that define the output arrays @see PickleDef
 * @return the string embeddedTables is returned unaltered
 */
export declare function pickle(embeddedTables: string, targetPickles: Array<PickleDef<any>>): string;
/**
 * Converts an array of Objects to a textual representation
 * @param pickles An Array of objects
 * @returns a gherkin text representation of the array of objects
 */
export declare function fromPickles(pickles: object[]): string;
export {};
