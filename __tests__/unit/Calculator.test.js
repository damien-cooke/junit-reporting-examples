const Calculator = require('../../src/utils/Calculator');

describe('Calculator Unit Tests', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Addition Operations', () => {
    test('should add two positive numbers correctly', () => {
      const result = calculator.add(2, 3);
      expect(result).toBe(5);
    });

    test('should add positive and negative numbers correctly', () => {
      const result = calculator.add(5, -3);
      expect(result).toBe(2);
    });

    test('should add two negative numbers correctly', () => {
      const result = calculator.add(-2, -3);
      expect(result).toBe(-5);
    });

    test('should handle zero addition', () => {
      expect(calculator.add(0, 5)).toBe(5);
      expect(calculator.add(5, 0)).toBe(5);
      expect(calculator.add(0, 0)).toBe(0);
    });

    test('should handle decimal numbers', () => {
      const result = calculator.add(1.5, 2.5);
      expect(result).toBeCloseTo(4.0);
    });

    test('should throw error for non-numeric input', () => {
      expect(() => calculator.add('a', 2)).toThrow('Both arguments must be numbers');
      expect(() => calculator.add(2, 'b')).toThrow('Both arguments must be numbers');
      expect(() => calculator.add(null, 2)).toThrow('Both arguments must be numbers');
    });
  });

  describe('Subtraction Operations', () => {
    test('should subtract two positive numbers correctly', () => {
      const result = calculator.subtract(5, 3);
      expect(result).toBe(2);
    });

    test('should handle negative results', () => {
      const result = calculator.subtract(3, 5);
      expect(result).toBe(-2);
    });

    test('should subtract negative numbers correctly', () => {
      const result = calculator.subtract(5, -3);
      expect(result).toBe(8);
    });

    test('should handle zero subtraction', () => {
      expect(calculator.subtract(5, 0)).toBe(5);
      expect(calculator.subtract(0, 5)).toBe(-5);
    });
  });

  describe('Multiplication Operations', () => {
    test('should multiply positive numbers correctly', () => {
      const result = calculator.multiply(3, 4);
      expect(result).toBe(12);
    });

    test('should handle multiplication by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 5)).toBe(0);
    });

    test('should handle negative number multiplication', () => {
      expect(calculator.multiply(-3, 4)).toBe(-12);
      expect(calculator.multiply(3, -4)).toBe(-12);
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should handle decimal multiplication', () => {
      const result = calculator.multiply(1.5, 2);
      expect(result).toBeCloseTo(3.0);
    });
  });

  describe('Division Operations', () => {
    test('should divide positive numbers correctly', () => {
      const result = calculator.divide(12, 4);
      expect(result).toBe(3);
    });

    test('should handle decimal division', () => {
      const result = calculator.divide(7, 2);
      expect(result).toBeCloseTo(3.5);
    });

    test('should handle negative number division', () => {
      expect(calculator.divide(-12, 4)).toBe(-3);
      expect(calculator.divide(12, -4)).toBe(-3);
      expect(calculator.divide(-12, -4)).toBe(3);
    });

    test('should throw error for division by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
    });
  });

  describe('Power Operations', () => {
    test('should calculate power correctly', () => {
      expect(calculator.power(2, 3)).toBe(8);
      expect(calculator.power(5, 2)).toBe(25);
      expect(calculator.power(3, 0)).toBe(1);
    });

    test('should handle negative exponents', () => {
      const result = calculator.power(2, -2);
      expect(result).toBeCloseTo(0.25);
    });

    test('should handle fractional exponents', () => {
      const result = calculator.power(9, 0.5);
      expect(result).toBeCloseTo(3);
    });
  });

  describe('Square Root Operations', () => {
    test('should calculate square root correctly', () => {
      expect(calculator.sqrt(9)).toBe(3);
      expect(calculator.sqrt(16)).toBe(4);
      expect(calculator.sqrt(0)).toBe(0);
    });

    test('should handle decimal square roots', () => {
      const result = calculator.sqrt(2);
      expect(result).toBeCloseTo(1.414, 3);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });

    test('should throw error for non-numeric input', () => {
      expect(() => calculator.sqrt('abc')).toThrow('Argument must be a number');
    });
  });

  describe('Factorial Operations', () => {
    test('should calculate factorial correctly', () => {
      expect(calculator.factorial(0)).toBe(1);
      expect(calculator.factorial(1)).toBe(1);
      expect(calculator.factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => calculator.factorial(-5)).toThrow('Cannot calculate factorial of negative number');
    });

    test('should throw error for non-integers', () => {
      expect(() => calculator.factorial(3.5)).toThrow('Argument must be an integer');
      expect(() => calculator.factorial('abc')).toThrow('Argument must be an integer');
    });
  });

  describe('Prime Number Operations', () => {
    test('should identify prime numbers correctly', () => {
      expect(calculator.isPrime(2)).toBe(true);
      expect(calculator.isPrime(3)).toBe(true);
      expect(calculator.isPrime(5)).toBe(true);
      expect(calculator.isPrime(7)).toBe(true);
      expect(calculator.isPrime(11)).toBe(true);
    });

    test('should identify non-prime numbers correctly', () => {
      expect(calculator.isPrime(1)).toBe(false);
      expect(calculator.isPrime(4)).toBe(false);
      expect(calculator.isPrime(6)).toBe(false);
      expect(calculator.isPrime(8)).toBe(false);
      expect(calculator.isPrime(9)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(calculator.isPrime(0)).toBe(false);
      expect(calculator.isPrime(-5)).toBe(false);
    });

    test('should throw error for non-integers', () => {
      expect(() => calculator.isPrime(3.5)).toThrow('Argument must be an integer');
    });
  });
});
