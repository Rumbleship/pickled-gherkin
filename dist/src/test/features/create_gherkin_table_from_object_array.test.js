"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pickle_1 = require("../../pickle");
describe(`Feature: Create a gherkin style text description from an array of objects`, () => {
    const expectedGherkinTable = ` id | description        | notes
 1  | 'description 1'    | note 1
 2  | 'description is 2' | note 2
 3  | 'description 3'    | note three
`;
    const pickledTable = pickle_1.pickleOne(expectedGherkinTable);
    describe(`Scenario: Create gherkin table from an array of plain objects
    Given: An array, pickledTable, of plain objects:
        ${JSON.stringify(pickledTable)}
    When: The Array is passed to fromPickle() 
    `, () => {
        let resultantGherkinTable = '';
        beforeAll(() => {
            resultantGherkinTable = pickle_1.fromPickles(pickledTable);
        });
        test(`Then: expect return to be: 
    ${expectedGherkinTable}
    `, () => {
            expect(resultantGherkinTable).toBe(expectedGherkinTable);
        });
    });
});
//# sourceMappingURL=create_gherkin_table_from_object_array.test.js.map