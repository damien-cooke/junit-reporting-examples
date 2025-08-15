class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    return a + b;
  }

  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    return a - b;
  }

  multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    return a * b;
  }

  divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  power(base, exponent) {
    if (typeof base !== 'number' || typeof exponent !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    return Math.pow(base, exponent);
  }

  sqrt(number) {
    if (typeof number !== 'number') {
      throw new Error('Argument must be a number');
    }
    if (number < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(number);
  }

  factorial(n) {
    if (typeof n !== 'number' || !Number.isInteger(n)) {
      throw new Error('Argument must be an integer');
    }
    if (n < 0) {
      throw new Error('Cannot calculate factorial of negative number');
    }
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * this.factorial(n - 1);
  }

  isPrime(number) {
    if (typeof number !== 'number' || !Number.isInteger(number)) {
      throw new Error('Argument must be an integer');
    }
    if (number < 2) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Calculator;
