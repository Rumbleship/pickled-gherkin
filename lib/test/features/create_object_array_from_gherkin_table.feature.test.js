"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const pickle_1 = require("../../pickle");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MyPickle {
}
__decorate([
    class_transformer_1.Type(() => Number),
    __metadata("design:type", Number)
], MyPickle.prototype, "id", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], MyPickle.prototype, "email", void 0);
__decorate([
    class_transformer_1.Type(() => Date),
    __metadata("design:type", Date)
], MyPickle.prototype, "registrationDate", void 0);
describe(`Feature: Create object array from gherkin style text description`, () => {
    const pickledTable = [];
    const anotherPickledTable = [];
    const myPickles = [];
    describe(`Scenario: Create plain objects from table
    Given: A three line gherkin Table:
        ${pickle_1.picklePassthrough(
    /* prettier-ignore */ `
         id | description     | notes
         1  | 'description 1' | note 1
         2  | 'description 2' | note 2
         3  | 'description 3' | note 3
         `, pickledTable)}
    When: The table has been processed as part of a describe using the picklePassthrough 
    function without a ClassType being passed in called pickledTable
    `, () => {
        test('Then: expect pickledTable to be an array of length 3:', () => {
            expect(pickledTable.length).toBe(3);
        });
        describe.each(pickledTable.map((pickle, index) => [index, pickle]))('Then: ', (indx, pickle) => {
            const id = `${indx + 1}`;
            test(`pickledTable[${indx}] is a plain object`, () => {
                expect(typeof pickle === 'object' && pickle !== null).toBeTruthy();
                expect(pickle.constructor.name).toBe('Object');
            });
            test(`pickledTable[${indx}].id is ${id}`, () => {
                expect(pickle.id).toBe(id);
            });
        });
    });
    describe(`Scenario: Create plain objects from MarkDown style table
    Given: A three line MarkDownStyle Table:
        ${pickle_1.picklePassthrough(
    /* prettier-ignore */ `
         id | description     | notes
         ---|-----------------|-------
         1  | 'description 1' | note 1
         2  | 'description 2' | note 2
         3  | 'description 3' | note 3
         `, anotherPickledTable)}
    When: The table has been processed as part of a describe using the picklePassthrough 
    function without a ClassType being passed in called anotherPickledTable
    `, () => {
        test('Then: expect anotherPickledTable to be an array of length 3:', () => {
            expect(anotherPickledTable.length).toBe(3);
        });
        describe.each(anotherPickledTable.map((pickle, index) => [index, pickle]))('Then: ', (indx, pickle) => {
            const id = `${indx + 1}`;
            test(`anotherPickledTable[${indx}] is a plain object`, () => {
                expect(typeof pickle === 'object' && pickle !== null).toBeTruthy();
                expect(pickle.constructor.name).toBe('Object');
            });
            test(`anotherPickledTable[${indx}].id is ${id}`, () => {
                expect(pickle.id).toBe(id);
            });
        });
    });
    describe(`Scenario: Create an array of Class instances from table which 
  uses class-transformer decorator to set the specific type
  Given: A three line gherkin Table:
      ${pickle_1.picklePassthrough(
    /* prettier-ignore */ `
        id | email       | password | registrationDate 
        1  | yo@bling.me | sparkle  | 20-APR-2019
        2  | bo@cling.to | hugs     | 2019-01-01
        3  | mo@moss.com | north    | 1964-64-64
       `, myPickles, MyPickle)}
  When: The table has been processed as part of a describe using the picklePassthrough 
  function with an array of myPickles and  a ClassType of MyPickle being passed in
  `, () => {
        test('Then: expect myPickles to be an array of length 3:', () => {
            expect(myPickles.length).toBe(3);
        });
        describe.each(myPickles.map((pickle, index) => [index, pickle]))('Then: ', (indx, pckle) => {
            const myPickle = pckle;
            const id = indx + 1;
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
    const badPickles = [];
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
            expect(() => pickle_1.picklePassthrough(badPicklesGiven, badPickles, MyPickle, undefined, true)).toThrow();
        });
    });
});
//# sourceMappingURL=create_object_array_from_gherkin_table.feature.test.js.map