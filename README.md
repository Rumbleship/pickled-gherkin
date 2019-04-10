# pickled-gherkin
**Who**: Typescript and Javascript software developers who use a Behaviour driven development (https://en.wikipedia.org/wiki/Behavior-driven_development) style for test specifications and want to integrate that approach into their Jest test framework and build process

**What**: Put seed and expectation data in a gherkin-style (https://docs.cucumber.io/gherkin/reference/) table embedded in a string literal and is parsed into Javascript objects and used directly in the executable test code. 


Simple text parser for converting a textual representation of a table into Javascript objects. The text uses the Cucumber style gherkin tables for seed data in Jest. Ideal for BDD, TDD 

**why**
By embedding one copy of test data into the test description that can be directly referenced from test code ensures that the test specifications and executable test scripts are aligned.

There are many excellent test runners and frameworks that fully support the full cucumber and gherkin language. This is the minimalist apporach to incorporating one of the most useful features into standard Jest code and framework.

## Usage


```
function pickle(embeddedTables: string, targetPickles: Array<PickleDef<any>>): string;
```
is the main way you access the functionality in the pickled-gherkin package.

For example using the Jest test runner :
``` 
const givenOrders: Order[] = [];
const addedOrders: Order[] = [];
const givenBuyers: Buyer[] = [];
describe(
  pickle(
    `
  Scenario: Add orders to the system 
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
  ), () => {
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
```
There are lower level functions that take a single gherkin-style table as well as a function to take an array of objects and return the gherkin-style table

See the test/features/*.test.ts files for examples of these functions.


