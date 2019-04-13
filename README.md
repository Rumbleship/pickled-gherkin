# pickled-gherkin
[![CircleCI](https://circleci.com/gh/Rumbleship/pickled-gherkin/tree/master.svg?style=svg&circle-token=fc70bbdabdb4e81ae6bbe622156ba2fc7f0edf63)](https://circleci.com/gh/Rumbleship/pickled-gherkin/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Rumbleship/pickled-gherkin/badge.svg?branch=master&t=Lmfbs2)](https://coveralls.io/github/Rumbleship/pickled-gherkin?branch=master)

##Motivation

We wanted to embed test data in an readible form in our test specifications without having to re-enter the data in the executable test scripts. The Cucumber/gherkin language solves this problem, however it doesnt easily integrate into existing our existing Jest and Ava frameworks. 

The approach here is a minimilist approach that doesnt require using a completely different test runner or framework to get the benefit of Behaviour Driven Developmnent (https://en.wikipedia.org/wiki/Behavior-driven_development)

##Usage

Pickled-gherkin is a package for parsing Gherkin tables (https://docs.cucumber.io/gherkin/reference/) into object arrays. For example, the following code creates an array of plain objects whose attributes are strings called 'prime_leg', 'even_leg' and 'hypotenuse'

```

// declare the array that the data is added to
const pythagorean_triples: object = []; 

pickle( `
@Table(pythagorean_triples)

prime_leg | even_leg | hypotenuse
    3     |    4     |     5
    5     |   12     |    13
   11     |   60     |    61
   19     |  180     |   181


`, [{ table: 'pythagorean_triples', array: pythagorean_triples }]
```
The entries in the table are 'pushed' to the array that is passed in. The `pickle` function returns the string that is passed in, so it can be easily used in test frameworks such as Jest or Ava as the description string. 

Alternatively, the array can be created directly from one table:

```
const pythagorean_triples = pickleOne( `
            prime_leg | even_leg | hypotenuse
                3     |    4     |     5
                5     |   12     |    13
               11     |   60     |    61
               19     |  180     |   181
         `);
```


Instead of plain object arrays, arrays of 'class' instances can be created. The package 'class-transformer' (https://github.com/typestack/class-transformer) is used in this case to transform each row into an instance of the passed in class. This allows for more complex objects to be created that have atttributes whose type is other than a string, such as  numbers and dates.

Optionally, a validate flag for each table may be set so after a row is converted to the object, the function `validateSync` from the package 'class-validator' (https://github.com/typestack/class-validator) is called. any validation errors are thrown. 

In the following example, both styles of table are shown (with or without markdown style headers) and class-transformer is used to transform the order tables rows to Order instances with the amount converted to a number. The column order_num is checked to ensure that each value is a numeric string.

It also shows how the arrays defined in the test specification are directly referenced and can be easily used in the Jest 'test.each()' syntax for testing the expectations.

``` 
import { pickle } from 'pickled-gherkin';
import { Type } from 'class-transformer';
import { isNumericString } from 'class-validator';

class Order {
  @IsNumericString()
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
describe(
  pickle(
    `
  Scenario: Adding new orders to our system
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
```

See the test/features/*.test.ts files for further examples.
