const request = require('supertest');
const app = require('../../src/index');

describe('API Integration Tests', () => {
  
  describe('Health Check Endpoint', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Root Endpoint', () => {
    test('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'JUnit Reporting Examples API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Calculator API', () => {
    test('should perform addition', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5, b: 3 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'add',
        a: 5,
        b: 3,
        result: 8
      });
    });

    test('should perform subtraction', async () => {
      const response = await request(app)
        .post('/api/calculator/subtract')
        .send({ a: 10, b: 4 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'subtract',
        a: 10,
        b: 4,
        result: 6
      });
    });

    test('should perform multiplication', async () => {
      const response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 6, b: 7 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'multiply',
        a: 6,
        b: 7,
        result: 42
      });
    });

    test('should perform division', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 15, b: 3 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'divide',
        a: 15,
        b: 3,
        result: 5
      });
    });

    test('should handle division by zero', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 10, b: 0 })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Division by zero is not allowed');
    });

    test('should handle invalid input types', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 'invalid', b: 3 })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Both arguments must be numbers');
    });

    test('should calculate power', async () => {
      const response = await request(app)
        .post('/api/calculator/power')
        .send({ base: 2, exponent: 3 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'power',
        base: 2,
        exponent: 3,
        result: 8
      });
    });

    test('should calculate square root', async () => {
      const response = await request(app)
        .post('/api/calculator/sqrt')
        .send({ number: 9 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'sqrt',
        number: 9,
        result: 3
      });
    });

    test('should calculate factorial', async () => {
      const response = await request(app)
        .post('/api/calculator/factorial')
        .send({ number: 5 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'factorial',
        number: 5,
        result: 120
      });
    });

    test('should check prime numbers', async () => {
      const response = await request(app)
        .post('/api/calculator/isPrime')
        .send({ number: 7 })
        .expect(200);
      
      expect(response.body).toEqual({
        operation: 'isPrime',
        number: 7,
        result: true
      });
    });
  });

  describe('Data Processing API', () => {
    test('should process array data', async () => {
      const response = await request(app)
        .post('/api/data/process')
        .send({ data: [1, 2, 3, 4, 5] })
        .expect(200);
      
      expect(response.body).toMatchObject({
        sum: 15,
        average: 3,
        min: 1,
        max: 5,
        count: 5,
        median: 3
      });
    });

    test('should filter data', async () => {
      const response = await request(app)
        .post('/api/data/filter')
        .send({ 
          data: [1, 2, 3, 4, 5], 
          condition: { type: 'greater', value: 3 }
        })
        .expect(200);
      
      expect(response.body).toEqual({
        filtered: [4, 5]
      });
    });

    test('should transform data', async () => {
      const response = await request(app)
        .post('/api/data/transform')
        .send({ 
          data: [1, 2, 3], 
          operation: 'double'
        })
        .expect(200);
      
      expect(response.body).toEqual({
        transformed: [2, 4, 6]
      });
    });

    test('should sort data', async () => {
      const data = [
        { name: 'Charlie', value: 3 },
        { name: 'Alice', value: 1 },
        { name: 'Bob', value: 2 }
      ];
      
      const response = await request(app)
        .post('/api/data/sort')
        .send({ data, field: 'value', order: 'asc' })
        .expect(200);
      
      expect(response.body.sorted[0].name).toBe('Alice');
      expect(response.body.sorted[2].name).toBe('Charlie');
    });

    test('should group data', async () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];
      
      const response = await request(app)
        .post('/api/data/group')
        .send({ data, key: 'category' })
        .expect(200);
      
      expect(response.body.grouped.A).toHaveLength(2);
      expect(response.body.grouped.B).toHaveLength(1);
    });

    test('should validate data', async () => {
      const data = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 }
      ];
      const schema = {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true }
      };
      
      const response = await request(app)
        .post('/api/data/validate')
        .send({ data, schema })
        .expect(200);
      
      expect(response.body.isValid).toBe(true);
      expect(response.body.errors).toHaveLength(0);
    });

    test('should handle invalid filter conditions', async () => {
      const response = await request(app)
        .post('/api/data/filter')
        .send({ 
          data: [1, 2, 3], 
          condition: { type: 'invalid', value: 2 }
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid condition type');
    });

    test('should handle invalid transform operations', async () => {
      const response = await request(app)
        .post('/api/data/transform')
        .send({ 
          data: [1, 2, 3], 
          operation: 'invalid'
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Invalid operation');
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });

    test('should handle missing request body', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send('invalid json')
        .expect(400);
      
      // Express should handle malformed JSON and return an error
    });
  });

  describe('Input Validation', () => {
    test('should validate required fields for calculator operations', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5 }) // missing b
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should validate data types for data processing', async () => {
      const response = await request(app)
        .post('/api/data/process')
        .send({ data: 'not an array' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Input must be an array');
    });
  });

  describe('Response Format Consistency', () => {
    test('should return consistent error format', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 10, b: 0 })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });

    test('should return consistent success format for calculator', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 1, b: 2 })
        .expect(200);
      
      expect(response.body).toHaveProperty('operation');
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('a');
      expect(response.body).toHaveProperty('b');
    });
  });

  describe('Content-Type Handling', () => {
    test('should handle JSON content type', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .set('Content-Type', 'application/json')
        .send('{"a": 1, "b": 2}')
        .expect(200);
      
      expect(response.body.result).toBe(3);
    });

    test('should handle URL-encoded content type', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('a=1&b=2')
        .expect(200);
      
      expect(response.body.result).toBe(3);
    });
  });
});
