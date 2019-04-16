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
const pickle_1 = require("../../pickle");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class Order {
}
__decorate([
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], Order.prototype, "order_num", void 0);
__decorate([
    class_transformer_1.Type(() => Number),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
class Buyer {
}
const givenOrders = [];
const addedOrders = [];
const givenBuyers = [];
describe(`Feature: Parse Gherkin tables from a describe string`, () => {
    describe(pickle_1.pickle(`
    Scenario: Parse Gherkin-style and markDown style tables from multiple tagged tables in a single describe string
    Given: There exist in the system the following buyers:

          @Table( givenBuyers ) 

                  buyer_id
                  --------
                  buyer_1  
                  buyer_2   
              

    And: following orders:
          @Table(givenOrders)
                  order_num | amount | buyer
                  ----------|--------|--------
                    0001    | 20     | buyer_1
                    0002    | 100    | buyer_2 
                    0003    | 10     | buyer_1
              

    When: The following new orders are added:

         @Table( addedOrders ) 

                  order_num | amount | buyer
                  0004      | 05     | buyer_1
                  0005      | 100    | buyer_2
              
            `, [
        { table: 'givenBuyers', array: givenBuyers, cls: Buyer },
        { table: 'givenOrders', array: givenOrders, cls: Order, validate: true },
        { table: 'addedOrders', array: addedOrders, cls: Order, validate: true }
    ]), () => {
        beforeAll(() => {
            setupGivens(givenBuyers, givenOrders); // seed the given orders into the system we are testing
            addOrders(addedOrders);
        });
        test.each(givenBuyers.map(buyer => [
            buyer.buyer_id,
            getExpectedTotalOrdersForBuyer(givenOrders.concat(addedOrders), buyer.buyer_id)
        ]))(`Then: expect the total for buyer: %s to be  %d`, (buyer_id, total_amount) => {
            expect(getTotalOrdersForBuyer(buyer_id)).toBe(total_amount);
        });
    });
    let given = '';
    describe(` 
  Scenario: table is tagged that doesn't have a corresponding Definition passed in 
     ${(given = `Given: an embedded tagged gherkin-style table:
          
     @Table( MyTable )

            col1 | col2
            x    | y
            z    | t
          
            
        When : pickle is called on it without a corresponding table definition:
     `)} `, () => {
        test(`Then: an Error is thrown`, () => {
            const anArray = [];
            expect(() => {
                pickle_1.pickle(given, [{ table: 'notThere', array: anArray }]);
            }).toThrow();
        });
    });
});
class MockSystem {
    constructor() {
        this.buyers = [];
        this.orders = [];
    }
}
const mockSystem = new MockSystem();
function setupGivens(buyers, orders) {
    // Reset the order system and make the API
    // call to add the users and orders
    // for this example, we just add to the mock
    mockSystem.buyers.push(...buyers);
    mockSystem.orders.push(...orders);
}
function addOrders(orders) {
    // Make the API call to add the orders to the order system
    // add to mock
    mockSystem.orders = mockSystem.orders.concat(orders);
}
function getTotalOrdersForBuyer(buyerId) {
    // Make API call to system to get the Orders total for buyer
    //
    // use mock...
    return getExpectedTotalOrdersForBuyer(mockSystem.orders, buyerId);
}
function getExpectedTotalOrdersForBuyer(orders, buyerId) {
    return orders.reduce((accumulator, order) => {
        if (order.buyer === buyerId) {
            accumulator += order.amount;
        }
        return accumulator;
    }, 0);
}
//# sourceMappingURL=pickle_tagged_tables.feature.test.js.map