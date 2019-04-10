import { pickle } from '../../pickle';
import { Type } from 'class-transformer';

class Order {
  order_num!: string;
  @Type(() => Number)
  amount!: number;
  buyer!: string;
}
class Buyer {
  buyer_id!: string;
}
const givenOrders: Order[] = [];
const addedOrders: Order[] = [];
const givenBuyers: Buyer[] = [];
describe(`Feature: Parse Gherkin-style tables from multiple tagged tables in a single describe string`, () => {
  describe(
    pickle(
      `
    Given: There exist in the system the following buyers:

              <Table: givenBuyers
                  buyer_id 
                  buyer_1  
                  buyer_2   
              >   
    And: following orders:

              <Table: givenOrders
                  order_num | amount | buyer
                    0001    | 20     | buyer_1
                    0002    | 100    | buyer_2 
                    0003    | 10     | buyer_1
              >

              

    When: The following new orders are added:
              <Table:  addedOrders
                  order_num | amount | buyer
                  0004      | 05     | buyer_1
                  0005      | 100    | buyer_2
              >

            `,
      [
        { table: 'givenBuyers', array: givenBuyers, cls: Buyer },
        { table: 'givenOrders', array: givenOrders, cls: Order },
        { table: 'addedOrders', array: addedOrders, cls: Order }
      ]
    ),
    () => {
      beforeAll(() => {
        setupGivens(givenBuyers, givenOrders); // seed the given orders into the system we are testing
        addOrders(addedOrders);
      });
      test.each(
        givenBuyers.map(buyer => [
          buyer.buyer_id,
          getExpectedTotalOrdersForBuyer(givenOrders.concat(addedOrders), buyer.buyer_id)
        ])
      )(`Then: expect the total for buyer: %s to be  %d`, (buyer_id, total_amount) => {
        expect(getTotalOrdersForBuyer(buyer_id as string)).toBe(total_amount as number);
      });
    }
  );
  let given = '';
  describe(` 
  Scenario: table is tagged that doesn't have a corresponding Definition passed in 
     ${(given = `Given: an embedded tagged gherkin-style table:
          <Table: MyTable
            col1 | col2
            x    | y
            z    | t
          >
            
        When : pickleTags() is called on it without a corresponding table definition:
     `)} `, () => {
    test(`Then: an Error is thrown`, () => {
      const anArray: object[] = [];
      expect(() => {
        pickle(given, [{ table: 'notThere', array: anArray }]);
      }).toThrow();
    });
  });
});
class MockSystem {
  buyers: Buyer[] = [];
  orders: Order[] = [];
}
const mockSystem = new MockSystem();

function setupGivens(buyers: Buyer[], orders: Order[]) {
  // Reset the order system and make the API
  // call to add the users and orders
  // for this example, we just add to the mock
  mockSystem.buyers.push(...buyers);
  mockSystem.orders.push(...orders);
}

function addOrders(orders: Order[]) {
  // Make the API call to add the orders to the order system
  // add to mock
  mockSystem.orders = mockSystem.orders.concat(orders);
}

function getTotalOrdersForBuyer(buyerId: string): number {
  // Make API call to system to get the Orders total for buyer
  //
  // use mock...
  return getExpectedTotalOrdersForBuyer(mockSystem.orders, buyerId);
}

function getExpectedTotalOrdersForBuyer(orders: Order[], buyerId: string): number {
  return orders.reduce((accumulator: number, order: Order) => {
    if (order.buyer === buyerId) {
      accumulator += order.amount;
    }
    return accumulator;
  }, 0);
}
