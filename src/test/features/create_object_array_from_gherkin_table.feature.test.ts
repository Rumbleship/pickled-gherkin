import 'reflect-metadata';
import { picklePassthrough } from '../../pickle';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

class MyPickle {
  @Type(() => Number)
  id!: number;
  @IsEmail()
  email!: string;
  password!: string;
  @Type(() => Date)
  registrationDate!: Date;
}

describe(`Feature: Create object array from gherkin style text description`, () => {
  const pickledTable: object[] = [];
  const anotherPickledTable: object[] = [];
  const myPickles: MyPickle[] = [];
  describe(`Scenario: Create plain objects from table
    Given: A three line gherkin Table:
        ${picklePassthrough(
          /* prettier-ignore */ `
         id | description     | notes
         1  | 'description 1' | note 1
         2  | 'description 2' | note 2
         3  | 'description 3' | note 3
         `,
          pickledTable
        )}
    When: The table has been processed as part of a describe using the picklePassthrough 
    function without a ClassType being passed in called pickledTable
    `, () => {
    test('Then: expect pickledTable to be an array of length 3:', () => {
      expect(pickledTable.length).toBe(3);
    });
    describe.each(pickledTable.map((pickle, index) => [index, pickle]))(
      'Then: ',
      (indx, pickle) => {
        const id = `${(indx as number) + 1}`;
        test(`pickledTable[${indx}] is a plain object`, () => {
          expect(typeof pickle === 'object' && pickle !== null).toBeTruthy();
          expect(pickle.constructor.name).toBe('Object');
        });
        test(`pickledTable[${indx}].id is ${id}`, () => {
          expect((pickle as any).id).toBe(id);
        });
      }
    );
  });
  describe(`Scenario: Create plain objects from MarkDown style table
    Given: A three line MarkDownStyle Table:
        ${picklePassthrough(
          /* prettier-ignore */ `
         id | description     | notes
         ---|-----------------|-------
         1  | 'description 1' | note 1
         2  | 'description 2' | note 2
         3  | 'description 3' | note 3
         `,
          anotherPickledTable
        )}
    When: The table has been processed as part of a describe using the picklePassthrough 
    function without a ClassType being passed in called anotherPickledTable
    `, () => {
    test('Then: expect anotherPickledTable to be an array of length 3:', () => {
      expect(anotherPickledTable.length).toBe(3);
    });
    describe.each(anotherPickledTable.map((pickle, index) => [index, pickle]))(
      'Then: ',
      (indx, pickle) => {
        const id = `${(indx as number) + 1}`;
        test(`anotherPickledTable[${indx}] is a plain object`, () => {
          expect(typeof pickle === 'object' && pickle !== null).toBeTruthy();
          expect(pickle.constructor.name).toBe('Object');
        });
        test(`anotherPickledTable[${indx}].id is ${id}`, () => {
          expect((pickle as any).id).toBe(id);
        });
      }
    );
  });
  describe(`Scenario: Create an array of Class instances from table which 
  uses class-transformer decorator to set the specific type
  Given: A three line gherkin Table:
      ${picklePassthrough(
        /* prettier-ignore */ `
        id | email       | password | registrationDate 
        1  | yo@bling.me | sparkle  | 20-APR-2019
        2  | bo@cling.to | hugs     | 2019-01-01
        3  | mo@moss.com | north    | 1964-64-64
       `,
        myPickles,
        MyPickle
      )}
  When: The table has been processed as part of a describe using the picklePassthrough 
  function with an array of myPickles and  a ClassType of MyPickle being passed in
  `, () => {
    test('Then: expect myPickles to be an array of length 3:', () => {
      expect(myPickles.length).toBe(3);
    });
    describe.each(myPickles.map((pickle, index) => [index, pickle]))('Then: ', (indx, pckle) => {
      const myPickle = pckle as MyPickle;
      const id = (indx as number) + 1;
      test(`myPickles[${indx}] is a plain object`, () => {
        expect(typeof myPickle === 'object' && myPickle !== null).toBeTruthy();
        expect(myPickle.constructor.name).toBe('MyPickle');
      });
      test(`myPickles[${indx}].id is a number whose value it ${id}`, () => {
        expect(typeof myPickle.id).toBe('number');
        expect(myPickle.id).toBe(id);
      });
      test(`myPickles[${indx}].registrationDate is a Date`, () => {
        expect(myPickle.registrationDate instanceof Date).toBe(true);
      });
    });
  });
  const badPickles: MyPickle[] = [];
  let badPicklesGiven = '';
  describe(`Scenario: Validation errors throw exceptions 

            Given: A valid one line gherkin Table:
                ${(badPicklesGiven = /* prettier-ignore */ `
                  id | email       | password | registrationDate 
                  1  | malformed   | sparkle  | 20-APR-2019
                `)}
               
            When: The table has been processed as part of a describe using the picklePassthrough 
            function with an array of myPickles and  a ClassType of MyPickle which has an @IsEmail decorator on the email attribute 
            And: validation is requested 
  `, () => {
    test('Then: expect an array of validationErrors to be thrown ', () => {
      expect(() =>
        picklePassthrough(badPicklesGiven, badPickles, MyPickle, undefined, true)
      ).toThrow();
    });
  });
});
