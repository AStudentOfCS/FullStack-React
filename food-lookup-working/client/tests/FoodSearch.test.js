// We populate this file in the chapter "Unit Testing"
/* eslint-disable no-unused-vars */
import { shallow } from 'enzyme';
import React from 'react';
import FoodSearch from '../src/FoodSearch';
import Client from '../src/Client';

// Using jest.mock() to mock 'Client' Library
jest.mock('../src/Client');

// From the beginning
describe('FoodSearch', () => {
  // ... initial state specs
  let wrapper;
  const onFoodClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <FoodSearch
        onFoodClick={onFoodClick}
      />
    );
  });

  // reset the mock between test runs
  afterEach(() => {
    Client.search.mockClear();
    onFoodClick.mockClear();
  });

  // 'remove icon' is not in the DOM
  it('should not display the remove icon', () => {
    expect(
      wrapper.find('.remove.icon').length
    ).toBe(0);
  });
  // the same as the code below:
  // it('should not display the remove icon', () => {
  //   expect(
  //     wrapper.containsAnyMatchingElements(
  //       <i className='remove icon' />
  //     )
  //   ).toBe(false);
  // });

  // the table doesn't have any entries
  it('should display zero rows', () => {
    expect(
      wrapper.find('tbody tr').length
    ).toEqual(0);
  });

  // A user has typed a value into the search field
  describe('user populates search field', () => {
    const value = 'brocc';

    beforeEach(() => {
      // ... simulate user typing "brocc" in input
      // declare 'input value' to be reference later in test
      const input = wrapper.find('input').first();
      input.simulate('change', {
        target: { value: value }
      });
    });

    // ... specs
    // assert that 'searchValue' has been updated in state
    // to match this new value
    it('should update state property `searchValue`', () => {
      expect(
        wrapper.state().searchValue
      ).toEqual(value);
    });

    // the 'remove icon' is present on the DOM
    it('should display the remove icon', () => {
      expect(
        wrapper.find('.remove.icon').length
      ).toBe(1);
    });

    // Example to see what's happening with 'mock'
    // it('...todo...', () => {
    //   const firstInvocation = Client.search.mock.calls[0];
    //   console.log('First invocation:');
    //   console.log(firstInvocation);
    //   console.log('All invocations: ');
    //   console.log(Client.search.mock.calls);
    // });

    // assert that the first argument passed to Client.search()
    // is the same value the user typed into the search field
    it('should call `Client.search()` with `value`', () => {
      const invocationArgs = Client.search.mock.calls[0];
      expect(
        invocationArgs[0]
      ).toEqual(value);
    });

    // The API returns results
    describe('and API returns results', () => {
      // an array foods as the fake result set returned by Client.search()
      const foods = [
        {
          description: 'Broccolini',
          kcal: '100',
          protein_g: '11',
          fat_g: '21',
          carbohydrate_g: '31',
        },
        {
          description: 'Broccoli rabe',
          kcal: '200',
          protein_g: '12',
          fat_g: '22',
          carbohydrate_g: '32',
        },
      ];

      beforeEach(() => {
        // ... simulate API returning results
        const invocationArgs = Client.search.mock.calls[0];
        const cb = invocationArgs[1];
        cb(foods);
        wrapper.update(); // after invoking the callback.
        // This will cause our component to re-render.
      });

      // ... specs
      // assert that the 'foods' property in state matches array of foods
      it('should set the state property `foods`', () => {
        expect(
          wrapper.state().foods
          // state() method when reading state from EnzymeWrapper
        ).toEqual(foods);
      });

      // assert that the table has two rows
      it('should display two rows', () => {
        expect(
          wrapper.find('tbody tr').length
        ).toEqual(2);
      });

      // assert that both of foods are actually printed in the table
      // in the HTML output
      // hunting for a unique string (description of foods),
      // there’s no need to use Enzyme’s selector API
      it('should render the description of first food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[0].description);
      });

      it('should render the description of second food', () => {
        expect(
          wrapper.html()
        ).toContain(foods[1].description);
      });

      // From here, there are a few behaviors the user can take with respect
      // to the 'FoodSearch' component as below:
      // 1. Click on a food item to add it to their total
      // 2. Type an additional character, appending to search string
      // 3. Hit backspace to remove a character or the entire of search string
      // 4. Click on the 'X' (remove icon) to clear the search field

      // 1. User click on a food item to add it to their total
      describe('then user clicks food item', () => {
        beforeEach(() => {
          // ... simulate user clicking food item
          const foodRow = wrapper.find('tbody tr').first();
          foodRow.simulate('click'); // simulate() auto re-render, no need wrapper.update()
        });

        // ... specs
        // assert that onFoodClick was invoked with the first food object in the foods array
        it('should call prop `onFoodClick` with `food`', () => {
          const food = foods[0];
          expect(
            onFoodClick.mock.calls[0]
          ).toEqual([ food ]);
        });
      });

      // 2. User can type an additional character,
      // appending to their search string
      // and return an empty result set (no results)
      describe('then user types more', () => {
        const value = 'broccx';
        beforeEach(() => {
          // ... simulate user typing "x"
          const input = wrapper.find('input').first();
          input.simulate('change', {
            target: { value: value }
          });
        });

        // API return no results of search found
        describe('and API returns no results', () => {
          beforeEach(() => {
            // ... simulate API returning no results
            const secondInvocationArgs = Client.search.mock.calls[1];
            const cb = secondInvocationArgs[1];
            cb([]);
            wrapper.update();
          });

          // ... specs
          // assert that the state property 'foods' is now an empty array
          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([]);
          })
        });
      });
    });
  });
});
