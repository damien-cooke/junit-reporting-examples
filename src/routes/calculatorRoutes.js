const express = require('express');
const Calculator = require('../utils/Calculator');

const router = express.Router();
const calculator = new Calculator();

// POST /api/calculator/add
router.post('/add', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = calculator.add(a, b);
    res.json({ operation: 'add', a, b, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/subtract
router.post('/subtract', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = calculator.subtract(a, b);
    res.json({ operation: 'subtract', a, b, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/multiply
router.post('/multiply', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = calculator.multiply(a, b);
    res.json({ operation: 'multiply', a, b, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/divide
router.post('/divide', (req, res) => {
  try {
    const { a, b } = req.body;
    const result = calculator.divide(a, b);
    res.json({ operation: 'divide', a, b, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/power
router.post('/power', (req, res) => {
  try {
    const { base, exponent } = req.body;
    const result = calculator.power(base, exponent);
    res.json({ operation: 'power', base, exponent, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/sqrt
router.post('/sqrt', (req, res) => {
  try {
    const { number } = req.body;
    const result = calculator.sqrt(number);
    res.json({ operation: 'sqrt', number, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/factorial
router.post('/factorial', (req, res) => {
  try {
    const { number } = req.body;
    const result = calculator.factorial(number);
    res.json({ operation: 'factorial', number, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/calculator/isPrime
router.post('/isPrime', (req, res) => {
  try {
    const { number } = req.body;
    const result = calculator.isPrime(number);
    res.json({ operation: 'isPrime', number, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
