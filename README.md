# pickled-gherkin
**Who**: Typescript and Javascript software developers who use a Behaviour driven development (https://en.wikipedia.org/wiki/Behavior-driven_development) style for test specifications

**What**: Express seed and expectation data in a readible text table embedded in the text specification that can be directly parsed into Javascript objects and used directly in the executable test code. 

For example using the Jest test runner:
``` 
const givenOrders: Order[] = [];
const addedOrders: Order[] = [];
const givenBuyers: Buyer[] = [];
describe(`Given: There exist in the system the following buyers:
          ${picklePassthrough(
            ` buyer_id | buyer_name
              buyer_1  | buyer One
              buyer_2  | buyer Two 
              `,
            givenBuyers
          )}
          And: following orders:
          ${picklePassthrough(
            ` order_num | amount | buyer
                0001    | 20     | buyer_1
                0002    | 100    | buyer_2 
                0003    | 10     | buyer_1
            `,
            givenOrders,
            Order
          )}
      `, () => {
  beforeAll(() => {
    setupGivens(givenBuyers, givenOrders); // seed the given orders into the system we are testing
  });
  describe(`When: The following new orders are added:
            ${picklePassthrough(
              ` order_num | amount | buyer
                0004      | 05     | buyer_1
                0005      | 100    | buyer_2
            `,
              addedOrders,
              Order
            )}
          `, () => {
    beforeAll(() => {
      // add oreders to the system
      addOrders(addedOrders);
      // setup the array of expected Orders to test against
    });
    test.each(
      givenBuyers.map(buyer => [
        buyer.buyer_id,
        getExpectedTotalOrdersForBuyer(givenOrders.concat(addedOrders), buyer.buyer_id)
      ])
    )(`Then: expect the total for buyer: %s to be  %d`, (buyer_id, total_amount) => {
      expect(getTotalOrdersForBuyer(buyer_id as string)).toBe(total_amount as number);
    });
  });
});

```

Simple text parser for converting a textual representation of a table into Javascript objects. The text uses the Cucumber style gherkin tables for seed data in Jest. Ideal for BDD, TDD 

## motivation
Behaviour driven development (https://en.wikipedia.org/wiki/Behavior-driven_development) has a very straightforward template feature specifications and corresponding acceptance criteria:


