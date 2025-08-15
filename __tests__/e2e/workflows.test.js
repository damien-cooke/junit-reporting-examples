const request = require('supertest');
const app = require('../../src/index');

describe('End-to-End Tests', () => {
  
  describe('Complete User Workflow', () => {
    test('should handle complete user management workflow', async () => {
      // 1. Check initial state
      let response = await request(app)
        .get('/api/users')
        .expect(200);
      
      const initialUserCount = response.body.length;
      
      // 2. Create a new user
      response = await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 25
        })
        .expect(201);
      
      const userId = response.body.id;
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.age).toBe(25);
      
      // 3. Verify user was created
      response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body.name).toBe('John Doe');
      
      // 4. Update the user
      response = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          name: 'John Updated',
          age: 26
        })
        .expect(200);
      
      expect(response.body.name).toBe('John Updated');
      expect(response.body.age).toBe(26);
      expect(response.body.email).toBe('john@example.com'); // Should remain unchanged
      
      // 5. Verify the update
      response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body.name).toBe('John Updated');
      expect(response.body.age).toBe(26);
      
      // 6. Check all users list
      response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body.length).toBe(initialUserCount + 1);
      
      // 7. Delete the user
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);
      
      // 8. Verify deletion
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
      
      // 9. Check final state
      response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body.length).toBe(initialUserCount);
    });

    test('should handle user search workflow', async () => {
      // Create test users
      const users = [
        { name: 'Alice Johnson', email: 'alice@example.com', age: 28 },
        { name: 'Bob Smith', email: 'bob@test.com', age: 32 },
        { name: 'Charlie Johnson', email: 'charlie@example.com', age: 24 }
      ];
      
      const createdUsers = [];
      for (const userData of users) {
        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect(201);
        createdUsers.push(response.body);
      }
      
      // Search by name
      let response = await request(app)
        .get('/api/users/search/johnson')
        .expect(200);
      
      expect(response.body.length).toBe(2);
      expect(response.body.every(user => user.name.toLowerCase().includes('johnson'))).toBe(true);
      
      // Search by email domain
      response = await request(app)
        .get('/api/users/search/example')
        .expect(200);
      
      expect(response.body.length).toBe(2);
      expect(response.body.every(user => user.email.includes('example'))).toBe(true);
      
      // Search with no results
      response = await request(app)
        .get('/api/users/search/nonexistent')
        .expect(200);
      
      expect(response.body.length).toBe(0);
      
      // Cleanup
      for (const user of createdUsers) {
        await request(app)
          .delete(`/api/users/${user.id}`)
          .expect(204);
      }
    });
  });

  describe('Complex Calculator Workflows', () => {
    test('should handle complex mathematical operations', async () => {
      // Test a series of operations that build on each other
      
      // Step 1: Calculate base value (5 + 3 = 8)
      let response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5, b: 3 })
        .expect(200);
      
      let result = response.body.result;
      expect(result).toBe(8);
      
      // Step 2: Square the result (8^2 = 64)
      response = await request(app)
        .post('/api/calculator/power')
        .send({ base: result, exponent: 2 })
        .expect(200);
      
      result = response.body.result;
      expect(result).toBe(64);
      
      // Step 3: Take square root (√64 = 8)
      response = await request(app)
        .post('/api/calculator/sqrt')
        .send({ number: result })
        .expect(200);
      
      result = response.body.result;
      expect(result).toBe(8);
      
      // Step 4: Calculate factorial (8! = 40320)
      response = await request(app)
        .post('/api/calculator/factorial')
        .send({ number: result })
        .expect(200);
      
      result = response.body.result;
      expect(result).toBe(40320);
      
      // Step 5: Divide by a large number (40320 / 1000 = 40.32)
      response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: result, b: 1000 })
        .expect(200);
      
      result = response.body.result;
      expect(result).toBeCloseTo(40.32);
    });

    test('should handle edge cases in mathematical operations', async () => {
      // Test zero operations
      let response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 100, b: 0 })
        .expect(200);
      
      expect(response.body.result).toBe(0);
      
      // Test power of zero
      response = await request(app)
        .post('/api/calculator/power')
        .send({ base: 5, exponent: 0 })
        .expect(200);
      
      expect(response.body.result).toBe(1);
      
      // Test square root of 1
      response = await request(app)
        .post('/api/calculator/sqrt')
        .send({ number: 1 })
        .expect(200);
      
      expect(response.body.result).toBe(1);
      
      // Test factorial of 0
      response = await request(app)
        .post('/api/calculator/factorial')
        .send({ number: 0 })
        .expect(200);
      
      expect(response.body.result).toBe(1);
      
      // Test prime number checking
      response = await request(app)
        .post('/api/calculator/isPrime')
        .send({ number: 2 })
        .expect(200);
      
      expect(response.body.result).toBe(true);
    });
  });

  describe('Data Processing Workflows', () => {
    test('should handle complex data transformation pipeline', async () => {
      const initialData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      // Step 1: Process the initial data
      let response = await request(app)
        .post('/api/data/process')
        .send({ data: initialData })
        .expect(200);
      
      expect(response.body.sum).toBe(55);
      expect(response.body.average).toBe(5.5);
      expect(response.body.count).toBe(10);
      
      // Step 2: Filter for numbers greater than 5
      response = await request(app)
        .post('/api/data/filter')
        .send({ 
          data: initialData, 
          condition: { type: 'greater', value: 5 }
        })
        .expect(200);
      
      const filteredData = response.body.filtered;
      expect(filteredData).toEqual([6, 7, 8, 9, 10]);
      
      // Step 3: Transform by doubling
      response = await request(app)
        .post('/api/data/transform')
        .send({ 
          data: filteredData, 
          operation: 'double'
        })
        .expect(200);
      
      const transformedData = response.body.transformed;
      expect(transformedData).toEqual([12, 14, 16, 18, 20]);
      
      // Step 4: Process the final transformed data
      response = await request(app)
        .post('/api/data/process')
        .send({ data: transformedData })
        .expect(200);
      
      expect(response.body.sum).toBe(80);
      expect(response.body.average).toBe(16);
      expect(response.body.min).toBe(12);
      expect(response.body.max).toBe(20);
    });

    test('should handle data validation and grouping workflow', async () => {
      const testData = [
        { category: 'A', value: 10, name: 'Item 1' },
        { category: 'B', value: 20, name: 'Item 2' },
        { category: 'A', value: 15, name: 'Item 3' },
        { category: 'C', value: 25, name: 'Item 4' },
        { category: 'B', value: 30, name: 'Item 5' }
      ];
      
      const schema = {
        category: { type: 'string', required: true },
        value: { type: 'number', required: true },
        name: { type: 'string', required: true }
      };
      
      // Step 1: Validate the data
      let response = await request(app)
        .post('/api/data/validate')
        .send({ data: testData, schema })
        .expect(200);
      
      expect(response.body.isValid).toBe(true);
      expect(response.body.errors).toHaveLength(0);
      
      // Step 2: Group by category
      response = await request(app)
        .post('/api/data/group')
        .send({ data: testData, key: 'category' })
        .expect(200);
      
      const grouped = response.body.grouped;
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(2);
      expect(grouped.C).toHaveLength(1);
      
      // Step 3: Sort by value
      response = await request(app)
        .post('/api/data/sort')
        .send({ data: testData, field: 'value', order: 'desc' })
        .expect(200);
      
      const sorted = response.body.sorted;
      expect(sorted[0].value).toBe(30);
      expect(sorted[sorted.length - 1].value).toBe(10);
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should handle partial failures gracefully', async () => {
      // Create a user successfully
      let response = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          age: 25
        })
        .expect(201);
      
      const userId = response.body.id;
      
      // Try to create another user with the same email (should fail)
      await request(app)
        .post('/api/users')
        .send({
          name: 'Another User',
          email: 'test@example.com', // Duplicate email
          age: 30
        })
        .expect(400);
      
      // Verify the first user still exists and is unaffected
      response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body.name).toBe('Test User');
      
      // Try invalid update (should fail)
      await request(app)
        .put(`/api/users/${userId}`)
        .send({
          email: 'invalid-email'
        })
        .expect(400);
      
      // Verify user data is unchanged
      response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body.email).toBe('test@example.com');
      
      // Cleanup
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);
    });

    test('should handle invalid data gracefully across operations', async () => {
      // Test calculator with invalid data
      await request(app)
        .post('/api/calculator/divide')
        .send({ a: 'invalid', b: 0 })
        .expect(400);
      
      // Test data processing with invalid data
      await request(app)
        .post('/api/data/process')
        .send({ data: 'not-an-array' })
        .expect(400);
      
      // Test user creation with invalid data
      await request(app)
        .post('/api/users')
        .send({
          name: '',
          email: 'invalid-email',
          age: -1
        })
        .expect(400);
      
      // Verify that the API is still functional after errors
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Performance and Load Handling', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = [];
      
      // Create multiple concurrent calculator requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .post('/api/calculator/add')
            .send({ a: i, b: i + 1 })
        );
      }
      
      const responses = await Promise.all(requests);
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.result).toBe(index + (index + 1));
      });
    });

    test('should handle large data processing requests', async () => {
      // Create a large dataset
      const largeData = Array.from({ length: 1000 }, (_, i) => i + 1);
      
      const response = await request(app)
        .post('/api/data/process')
        .send({ data: largeData })
        .expect(200);
      
      expect(response.body.count).toBe(1000);
      expect(response.body.sum).toBe(500500); // Sum of 1 to 1000
      expect(response.body.average).toBe(500.5);
      expect(response.body.min).toBe(1);
      expect(response.body.max).toBe(1000);
    });
  });
});
