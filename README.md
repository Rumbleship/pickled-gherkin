# pickled-gherkin

[![CircleCI](https://circleci.com/gh/Rumbleship/pickled-gherkin/tree/master.svg?style=svg&circle-token=fc70bbdabdb4e81ae6bbe622156ba2fc7f0edf63)](https://circleci.com/gh/Rumbleship/pickled-gherkin/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Rumbleship/pickled-gherkin/badge.svg?branch=master&t=Lmfbs2)](https://coveralls.io/github/Rumbleship/pickled-gherkin?branch=master)

**Who**: Typescript and Javascript software developers who use a Behaviour driven development (https://en.wikipedia.org/wiki/Behavior-driven_development) style for test specifications

**What**: Put seed and expectation data in a gherkin-style table embedded in a string literal. that is parsed into Javascript objects and used directly in the executable test code. 

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

Simple text parser for converting a textual representation of a table into Javascript objects. The text uses the Cucumber style gherkin tables for seed data in Jest. Ideal for BDD, TDD 

## motivation
Behaviour driven development (https://en.wikipedia.org/wiki/Behavior-driven_development) has a very straightforward template feature specifications and corresponding acceptance criteria:


