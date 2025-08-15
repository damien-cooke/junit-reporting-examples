const express = require('express');
const DataProcessor = require('../utils/DataProcessor');

const router = express.Router();

// POST /api/data/process
router.post('/process', (req, res) => {
  try {
    const { data } = req.body;
    const result = DataProcessor.processArray(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/data/filter
router.post('/filter', (req, res) => {
  try {
    const { data, condition } = req.body;
    let predicate;
    
    switch (condition.type) {
      case 'greater':
        predicate = (item) => item > condition.value;
        break;
      case 'less':
        predicate = (item) => item < condition.value;
        break;
      case 'equal':
        predicate = (item) => item === condition.value;
        break;
      default:
        throw new Error('Invalid condition type');
    }
    
    const result = DataProcessor.filterData(data, predicate);
    res.json({ filtered: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/data/transform
router.post('/transform', (req, res) => {
  try {
    const { data, operation } = req.body;
    let transformer;
    
    switch (operation) {
      case 'double':
        transformer = (item) => item * 2;
        break;
      case 'square':
        transformer = (item) => item * item;
        break;
      case 'increment':
        transformer = (item) => item + 1;
        break;
      default:
        throw new Error('Invalid operation');
    }
    
    const result = DataProcessor.transformData(data, transformer);
    res.json({ transformed: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/data/sort
router.post('/sort', (req, res) => {
  try {
    const { data, field, order } = req.body;
    const result = DataProcessor.sortData(data, field, order);
    res.json({ sorted: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/data/group
router.post('/group', (req, res) => {
  try {
    const { data, key } = req.body;
    const result = DataProcessor.groupBy(data, key);
    res.json({ grouped: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/data/validate
router.post('/validate', (req, res) => {
  try {
    const { data, schema } = req.body;
    const result = DataProcessor.validateData(data, schema);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
