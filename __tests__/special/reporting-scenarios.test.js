describe('Special Test Scenarios for JUnit Reporting', () => {
  
  describe('Skipped Tests', () => {
    test.skip('this test is intentionally skipped for reporting demo', () => {
      expect(true).toBe(false); // This would fail if run
    });

    test.skip('another skipped test with different reason', () => {
      throw new Error('This should never execute');
    });

    it.skip('skipped test using it.skip', () => {
      expect(1 + 1).toBe(3);
    });

    describe.skip('entire skipped test suite', () => {
      test('test 1 in skipped suite', () => {
        expect(true).toBe(true);
      });

      test('test 2 in skipped suite', () => {
        expect(false).toBe(false);
      });
    });
  });

  describe('Pending Tests', () => {
    test('this test is marked as todo', () => {
      // TODO: Implement this test
    });

    it.todo('pending test without implementation'); // No function provided

    test('test marked as pending with reason', () => {
      pending('Waiting for API endpoint to be implemented');
    });
  });

  describe('Timeout Tests', () => {
    test('test with custom timeout', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(true).toBe(true);
    }, 5000); // 5 second timeout

    test('fast test with short timeout', () => {
      expect(1 + 1).toBe(2);
    }, 50); // 50ms timeout

    test.skip('intentionally slow test that would timeout', async () => {
      await new Promise(resolve => setTimeout(resolve, 6000)); // 6 seconds
      expect(true).toBe(true);
    }, 1000); // 1 second timeout - would fail if not skipped
  });

  describe('Failing Tests (Commented Out)', () => {
    // Uncomment these tests to see failure scenarios in reports
    
    test.skip('assertion failure test', () => {
      expect(1 + 1).toBe(3);
    });

    test.skip('error throwing test', () => {
      throw new Error('This is an intentional error for testing');
    });

    test.skip('async test failure', async () => {
      await Promise.reject(new Error('Async operation failed'));
    });

    test.skip('timeout failure test', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      expect(true).toBe(true);
    }, 100); // This would timeout

    test.skip('multiple assertion failures', () => {
      expect(1).toBe(2);
      expect(true).toBe(false);
      expect('hello').toBe('world');
    });
  });

  describe('Nested Test Suites', () => {
    describe('Level 1', () => {
      describe('Level 2', () => {
        describe('Level 3', () => {
          test('deeply nested test', () => {
            expect('nested').toBe('nested');
          });

          test('another deeply nested test', () => {
            expect(Math.PI).toBeCloseTo(3.14159, 4);
          });
        });

        test('level 2 test', () => {
          expect(Array.isArray([])).toBe(true);
        });
      });

      test('level 1 test', () => {
        expect(typeof 'string').toBe('string');
      });
    });
  });

  describe('Tests with Rich Descriptions', () => {
    test('test with emoji in title 🧪', () => {
      expect('emoji').toContain('moji');
    });

    test('test with special characters: !@#$%^&*()', () => {
      expect('special').toMatch(/^special$/);
    });

    test('test with very long description that might be truncated in some reporting tools and contains lots of detail about what it is testing including edge cases and expected behavior', () => {
      expect(true).not.toBe(false);
    });

    test('test with "quotes" and \'apostrophes\' and <brackets>', () => {
      expect('"quoted"').toContain('quote');
    });
  });

  describe('Parameterized Test Scenarios', () => {
    const testCases = [
      { input: 1, expected: 2 },
      { input: 2, expected: 4 },
      { input: 3, expected: 6 },
      { input: 0, expected: 0 },
      { input: -1, expected: -2 }
    ];

    testCases.forEach(({ input, expected }) => {
      test(`should double ${input} to get ${expected}`, () => {
        expect(input * 2).toBe(expected);
      });
    });

    const edgeCases = [
      { value: null, description: 'null value' },
      { value: undefined, description: 'undefined value' },
      { value: '', description: 'empty string' },
      { value: 0, description: 'zero value' },
      { value: [], description: 'empty array' }
    ];

    edgeCases.forEach(({ value, description }) => {
      test(`should handle edge case: ${description}`, () => {
        expect(value).toBeDefined(); // This will fail for undefined
      });
    });
  });

  describe('Performance Tests', () => {
    test('array processing performance', () => {
      const start = Date.now();
      const largeArray = new Array(100000).fill(0).map((_, i) => i);
      const sum = largeArray.reduce((a, b) => a + b, 0);
      const end = Date.now();
      
      expect(sum).toBe(4999950000);
      expect(end - start).toBeLessThan(1000); // Should complete in less than 1 second
    });

    test('string manipulation performance', () => {
      const start = Date.now();
      let result = '';
      for (let i = 0; i < 10000; i++) {
        result += `item-${i}-`;
      }
      const end = Date.now();
      
      expect(result).toContain('item-9999-');
      expect(end - start).toBeLessThan(500); // Should complete in less than 500ms
    });
  });

  describe('Async Test Patterns', () => {
    test('promise resolution test', async () => {
      const result = await Promise.resolve('success');
      expect(result).toBe('success');
    });

    test('multiple async operations', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
      ];
      
      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2, 3]);
    });

    test('async operation with delay', async () => {
      const start = Date.now();
      await new Promise(resolve => setTimeout(resolve, 50));
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(45); // Account for timing variations
    });

    test('async callback conversion', (done) => {
      setTimeout(() => {
        expect(true).toBe(true);
        done();
      }, 10);
    });
  });

  describe('Mock and Spy Tests', () => {
    test('function mock test', () => {
      const mockFn = jest.fn();
      mockFn('arg1', 'arg2');
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('spy on console.log', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      console.log('test message');
      
      expect(logSpy).toHaveBeenCalledWith('test message');
      logSpy.mockRestore();
    });

    test('mock return values', () => {
      const mockFn = jest.fn()
        .mockReturnValueOnce('first call')
        .mockReturnValueOnce('second call')
        .mockReturnValue('default');
      
      expect(mockFn()).toBe('first call');
      expect(mockFn()).toBe('second call');
      expect(mockFn()).toBe('default');
    });
  });

  describe('Snapshot Tests', () => {
    test('object snapshot', () => {
      const testObject = {
        id: 1,
        name: 'Test Object',
        created: new Date('2023-01-01'),
        metadata: {
          version: '1.0.0',
          tags: ['test', 'snapshot']
        }
      };
      
      expect(testObject).toMatchSnapshot();
    });

    test('array snapshot', () => {
      const testArray = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ];
      
      expect(testArray).toMatchSnapshot();
    });
  });

  describe('Matcher Variety Tests', () => {
    test('string matchers', () => {
      const testString = 'Hello World Testing';
      
      expect(testString).toMatch(/Hello/);
      expect(testString).toContain('World');
      expect(testString).toHaveLength(19);
      expect(testString).toMatch(/^Hello/);
      expect(testString).toMatch(/Testing$/);
    });

    test('number matchers', () => {
      const testNumber = 42;
      const floatNumber = 3.14159;
      
      expect(testNumber).toBeGreaterThan(40);
      expect(testNumber).toBeLessThan(50);
      expect(testNumber).toBeCloseTo(42, 0);
      expect(floatNumber).toBeCloseTo(3.14, 2);
    });

    test('array and object matchers', () => {
      const testArray = [1, 2, 3, 4, 5];
      const testObject = { a: 1, b: 2, c: { d: 3 } };
      
      expect(testArray).toContain(3);
      expect(testArray).toHaveLength(5);
      expect(testObject).toHaveProperty('a');
      expect(testObject).toHaveProperty('c.d', 3);
      expect(testObject).toMatchObject({ a: 1, b: 2 });
    });

    test('truthiness matchers', () => {
      expect(true).toBeTruthy();
      expect(false).toBeFalsy();
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      expect('hello').toBeDefined();
      expect(NaN).toBeNaN();
    });
  });
});
