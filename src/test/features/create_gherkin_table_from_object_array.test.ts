import { pickle, fromPickles } from '../../pickle';

describe(`Feature: Create a gherkin style text description from an array of objects`, () => {
  const expectedGherkinTable = ` id | description        | notes
 1  | 'description 1'    | note 1
 2  | 'description is 2' | note 2
 3  | 'description 3'    | note three
`;
  const pickledTable: object[] = pickle(expectedGherkinTable);

  describe(`Scenario: Create gherkin table from an array of plain objects
    Given: An array, pickledTable, of plain objects:
        ${JSON.stringify(pickledTable)}
    When: The Array is passed to fromPickle() 
    `, () => {
    let resultantGherkinTable: string = '';
    beforeAll(() => {
      resultantGherkinTable = fromPickles(pickledTable);
    });
    test(`Then: expect return to be: 
    ${expectedGherkinTable}
    `, () => {
      expect(resultantGherkinTable).toBe(expectedGherkinTable);
    });
  });
});
