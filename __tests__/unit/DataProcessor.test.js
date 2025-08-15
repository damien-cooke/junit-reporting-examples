const DataProcessor = require('../../src/utils/DataProcessor');

describe('DataProcessor Unit Tests', () => {
  
  describe('Array Processing', () => {
    test('should process array of numbers correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const result = DataProcessor.processArray(data);
      
      expect(result.sum).toBe(15);
      expect(result.average).toBe(3);
      expect(result.min).toBe(1);
      expect(result.max).toBe(5);
      expect(result.count).toBe(5);
      expect(result.median).toBe(3);
    });

    test('should handle empty array', () => {
      const data = [];
      const result = DataProcessor.processArray(data);
      
      expect(result.sum).toBe(0);
      expect(result.count).toBe(0);
      expect(result.median).toBe(null);
    });

    test('should handle array with one element', () => {
      const data = [42];
      const result = DataProcessor.processArray(data);
      
      expect(result.sum).toBe(42);
      expect(result.average).toBe(42);
      expect(result.min).toBe(42);
      expect(result.max).toBe(42);
      expect(result.median).toBe(42);
    });

    test('should throw error for non-array input', () => {
      expect(() => DataProcessor.processArray('not-array')).toThrow('Input must be an array');
      expect(() => DataProcessor.processArray(null)).toThrow('Input must be an array');
      expect(() => DataProcessor.processArray({})).toThrow('Input must be an array');
    });
  });

  describe('Median Calculation', () => {
    test('should calculate median for odd-length array', () => {
      const result = DataProcessor.calculateMedian([1, 3, 5, 7, 9]);
      expect(result).toBe(5);
    });

    test('should calculate median for even-length array', () => {
      const result = DataProcessor.calculateMedian([1, 2, 3, 4]);
      expect(result).toBe(2.5);
    });

    test('should handle unsorted array', () => {
      const result = DataProcessor.calculateMedian([5, 1, 9, 3, 7]);
      expect(result).toBe(5);
    });

    test('should return null for empty array', () => {
      const result = DataProcessor.calculateMedian([]);
      expect(result).toBe(null);
    });

    test('should return null for non-array input', () => {
      const result = DataProcessor.calculateMedian('not-array');
      expect(result).toBe(null);
    });
  });

  describe('Mode Calculation', () => {
    test('should calculate mode for array with single mode', () => {
      const result = DataProcessor.calculateMode([1, 2, 2, 3, 4]);
      expect(result).toEqual([2]);
    });

    test('should calculate multiple modes', () => {
      const result = DataProcessor.calculateMode([1, 1, 2, 2, 3]);
      expect(result).toEqual([1, 2]);
    });

    test('should return null when all values appear once', () => {
      const result = DataProcessor.calculateMode([1, 2, 3, 4, 5]);
      expect(result).toBe(null);
    });

    test('should return null for empty array', () => {
      const result = DataProcessor.calculateMode([]);
      expect(result).toBe(null);
    });
  });

  describe('Data Filtering', () => {
    test('should filter data correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x) => x > 3;
      const result = DataProcessor.filterData(data, predicate);
      
      expect(result).toEqual([4, 5]);
    });

    test('should return empty array when no matches', () => {
      const data = [1, 2, 3];
      const predicate = (x) => x > 10;
      const result = DataProcessor.filterData(data, predicate);
      
      expect(result).toEqual([]);
    });

    test('should throw error for non-array data', () => {
      expect(() => DataProcessor.filterData('not-array', x => x)).toThrow('Data must be an array');
    });

    test('should throw error for non-function predicate', () => {
      expect(() => DataProcessor.filterData([1, 2, 3], 'not-function')).toThrow('Predicate must be a function');
    });
  });

  describe('Data Transformation', () => {
    test('should transform data correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const transformer = (x) => x * 2;
      const result = DataProcessor.transformData(data, transformer);
      
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    test('should handle empty array', () => {
      const data = [];
      const transformer = (x) => x * 2;
      const result = DataProcessor.transformData(data, transformer);
      
      expect(result).toEqual([]);
    });

    test('should throw error for non-array data', () => {
      expect(() => DataProcessor.transformData('not-array', x => x)).toThrow('Data must be an array');
    });

    test('should throw error for non-function transformer', () => {
      expect(() => DataProcessor.transformData([1, 2, 3], 'not-function')).toThrow('Transformer must be a function');
    });
  });

  describe('Data Grouping', () => {
    test('should group data by property', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];
      const result = DataProcessor.groupBy(data, 'category');
      
      expect(result.A).toHaveLength(2);
      expect(result.B).toHaveLength(1);
    });

    test('should throw error for non-array data', () => {
      expect(() => DataProcessor.groupBy('not-array', 'key')).toThrow('Data must be an array');
    });
  });

  describe('Data Sorting', () => {
    test('should sort data in ascending order', () => {
      const data = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const result = DataProcessor.sortData(data, 'value', 'asc');
      
      expect(result[0].value).toBe(1);
      expect(result[1].value).toBe(2);
      expect(result[2].value).toBe(3);
    });

    test('should sort data in descending order', () => {
      const data = [{ value: 1 }, { value: 3 }, { value: 2 }];
      const result = DataProcessor.sortData(data, 'value', 'desc');
      
      expect(result[0].value).toBe(3);
      expect(result[1].value).toBe(2);
      expect(result[2].value).toBe(1);
    });

    test('should default to ascending order', () => {
      const data = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const result = DataProcessor.sortData(data, 'value');
      
      expect(result[0].value).toBe(1);
      expect(result[2].value).toBe(3);
    });

    test('should throw error for non-array data', () => {
      expect(() => DataProcessor.sortData('not-array', 'key')).toThrow('Data must be an array');
    });
  });

  describe('Async Data Processing', () => {
    test('should process async data correctly', async () => {
      const data = [1, 2, 3];
      const asyncProcessor = async (x) => x * 2;
      const result = await DataProcessor.processAsyncData(data, asyncProcessor);
      
      expect(result).toEqual([2, 4, 6]);
    });

    test('should handle async errors', async () => {
      const data = [1, 2, 3];
      const asyncProcessor = async (x) => {
        if (x === 2) throw new Error('Async error');
        return x * 2;
      };
      
      await expect(DataProcessor.processAsyncData(data, asyncProcessor)).rejects.toThrow('Async error');
    });

    test('should throw error for non-array data', async () => {
      await expect(DataProcessor.processAsyncData('not-array', async x => x)).rejects.toThrow('Data must be an array');
    });

    test('should throw error for non-function processor', async () => {
      await expect(DataProcessor.processAsyncData([1, 2, 3], 'not-function')).rejects.toThrow('Async processor must be a function');
    });
  });

  describe('Data Validation', () => {
    test('should validate data correctly', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true }
      };
      
      const result = DataProcessor.validateData(data, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing required fields', () => {
      const data = [
        { name: 'John' }, // missing age
        { age: 25 } // missing name
      ];
      const schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true }
      };
      
      const result = DataProcessor.validateData(data, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    test('should detect type mismatches', () => {
      const data = [
        { name: 123, age: 'thirty' } // wrong types
      ];
      const schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true }
      };
      
      const result = DataProcessor.validateData(data, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    test('should throw error for non-array data', () => {
      const schema = { name: { type: 'string', required: true } };
      expect(() => DataProcessor.validateData('not-array', schema)).toThrow('Data must be an array');
    });
  });
});
