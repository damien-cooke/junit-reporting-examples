const UserService = require('../../src/services/UserService');

describe('UserService Integration Tests', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('User Creation', () => {
    test('should create user successfully', async () => {
      const user = await userService.createUser('John Doe', 'john@example.com', 25);
      
      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(25);
      expect(user.isActive).toBe(true);
    });

    test('should auto-increment user IDs', async () => {
      const user1 = await userService.createUser('John', 'john@example.com', 25);
      const user2 = await userService.createUser('Jane', 'jane@example.com', 30);
      
      expect(user1.id).toBe(1);
      expect(user2.id).toBe(2);
    });

    test('should reject invalid user data', async () => {
      await expect(userService.createUser('', 'john@example.com', 25)).rejects.toThrow('Invalid name');
      await expect(userService.createUser('John', 'invalid-email', 25)).rejects.toThrow('Invalid email');
      await expect(userService.createUser('John', 'john@example.com', -1)).rejects.toThrow('Invalid age');
    });

    test('should reject duplicate emails', async () => {
      await userService.createUser('John', 'john@example.com', 25);
      
      await expect(userService.createUser('Jane', 'john@example.com', 30)).rejects.toThrow('Email already exists');
    });
  });

  describe('User Retrieval', () => {
    beforeEach(async () => {
      await userService.createUser('John Doe', 'john@example.com', 25);
      await userService.createUser('Jane Smith', 'jane@example.com', 30);
    });

    test('should get user by ID', async () => {
      const user = await userService.getUserById(1);
      
      expect(user).not.toBeNull();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    test('should return null for non-existent user ID', async () => {
      const user = await userService.getUserById(999);
      expect(user).toBeNull();
    });

    test('should get user by email', async () => {
      const user = await userService.getUserByEmail('jane@example.com');
      
      expect(user).not.toBeNull();
      expect(user.name).toBe('Jane Smith');
      expect(user.id).toBe(2);
    });

    test('should return null for non-existent email', async () => {
      const user = await userService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });

    test('should get all users', async () => {
      const users = await userService.getAllUsers();
      
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('John Doe');
      expect(users[1].name).toBe('Jane Smith');
    });

    test('should return empty array when no users exist', async () => {
      const emptyService = new UserService();
      const users = await emptyService.getAllUsers();
      
      expect(users).toHaveLength(0);
    });
  });

  describe('User Updates', () => {
    let userId;

    beforeEach(async () => {
      const user = await userService.createUser('John Doe', 'john@example.com', 25);
      userId = user.id;
    });

    test('should update user successfully', async () => {
      const updatedUser = await userService.updateUser(userId, {
        name: 'John Updated',
        age: 26
      });
      
      expect(updatedUser.name).toBe('John Updated');
      expect(updatedUser.age).toBe(26);
      expect(updatedUser.email).toBe('john@example.com'); // Unchanged
    });

    test('should validate updates', async () => {
      await expect(userService.updateUser(userId, { email: 'invalid-email' })).rejects.toThrow('Invalid email');
      await expect(userService.updateUser(userId, { age: -1 })).rejects.toThrow('Invalid age');
      await expect(userService.updateUser(userId, { name: '' })).rejects.toThrow('Invalid name');
    });

    test('should throw error for non-existent user', async () => {
      await expect(userService.updateUser(999, { name: 'Updated' })).rejects.toThrow('User not found');
    });
  });

  describe('User Deletion', () => {
    let userId;

    beforeEach(async () => {
      const user = await userService.createUser('John Doe', 'john@example.com', 25);
      userId = user.id;
    });

    test('should delete user successfully', async () => {
      const result = await userService.deleteUser(userId);
      expect(result).toBe(true);
      
      const deletedUser = await userService.getUserById(userId);
      expect(deletedUser).toBeNull();
    });

    test('should throw error for non-existent user', async () => {
      await expect(userService.deleteUser(999)).rejects.toThrow('User not found');
    });

    test('should update user count after deletion', async () => {
      const initialCount = await userService.getUserCount();
      await userService.deleteUser(userId);
      const finalCount = await userService.getUserCount();
      
      expect(finalCount).toBe(initialCount - 1);
    });
  });

  describe('Filtered User Retrieval', () => {
    beforeEach(async () => {
      await userService.createUser('Adult User', 'adult@example.com', 25);
      await userService.createUser('Minor User', 'minor@example.com', 16);
      await userService.createUser('Senior User', 'senior@example.com', 65);
      
      // Deactivate one user
      const users = await userService.getAllUsers();
      users[1].deactivate();
    });

    test('should get only active users', async () => {
      const activeUsers = await userService.getActiveUsers();
      
      expect(activeUsers).toHaveLength(2); // Adult and Senior (Minor is deactivated)
      activeUsers.forEach(user => {
        expect(user.isActive).toBe(true);
      });
    });

    test('should get only adult users', async () => {
      const adultUsers = await userService.getAdultUsers();
      
      expect(adultUsers).toHaveLength(2); // Adult and Senior
      adultUsers.forEach(user => {
        expect(user.isAdult()).toBe(true);
      });
    });
  });

  describe('User Search', () => {
    beforeEach(async () => {
      await userService.createUser('John Doe', 'john@example.com', 25);
      await userService.createUser('Jane Smith', 'jane@smith.com', 30);
      await userService.createUser('Bob Johnson', 'bob@johnson.com', 35);
    });

    test('should search users by name', async () => {
      const results = await userService.searchUsers('john');
      
      expect(results).toHaveLength(2); // John Doe and Bob Johnson
      expect(results.some(user => user.name === 'John Doe')).toBe(true);
      expect(results.some(user => user.name === 'Bob Johnson')).toBe(true);
    });

    test('should search users by email', async () => {
      const results = await userService.searchUsers('smith');
      
      expect(results).toHaveLength(2); // Jane Smith and by email domain
      expect(results.some(user => user.name === 'Jane Smith')).toBe(true);
    });

    test('should return empty array for no matches', async () => {
      const results = await userService.searchUsers('nonexistent');
      expect(results).toHaveLength(0);
    });

    test('should be case insensitive', async () => {
      const results = await userService.searchUsers('JOHN');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Error Simulation', () => {
    test('should simulate error correctly', async () => {
      await expect(userService.simulateError()).rejects.toThrow('Simulated error for testing');
    });

    test('should handle flaky operations', async () => {
      let successCount = 0;
      let errorCount = 0;
      
      // Run flaky operation multiple times
      for (let i = 0; i < 10; i++) {
        try {
          await userService.flakyOperation();
          successCount++;
        } catch (error) {
          errorCount++;
          expect(error.message).toBe('Flaky operation failed');
        }
      }
      
      // Should have some successes and some failures (flaky behavior)
      expect(successCount + errorCount).toBe(10);
    });
  });

  describe('Async Operations and Performance', () => {
    test('should handle multiple concurrent user creations', async () => {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(userService.createUser(`User ${i}`, `user${i}@example.com`, 20 + i));
      }
      
      const users = await Promise.all(promises);
      
      expect(users).toHaveLength(5);
      users.forEach((user, index) => {
        expect(user.name).toBe(`User ${index}`);
        expect(user.id).toBeDefined();
      });
    });

    test('should handle async operations with proper timing', async () => {
      const startTime = Date.now();
      await userService.createUser('Timed User', 'timed@example.com', 25);
      const endTime = Date.now();
      
      // Should take at least 10ms (the simulated delay)
      expect(endTime - startTime).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Data Consistency', () => {
    test('should maintain data consistency across operations', async () => {
      // Create users
      await userService.createUser('User 1', 'user1@example.com', 25);
      await userService.createUser('User 2', 'user2@example.com', 30);
      
      let count = await userService.getUserCount();
      expect(count).toBe(2);
      
      // Update a user
      await userService.updateUser(1, { name: 'Updated User 1' });
      
      // Count should remain the same
      count = await userService.getUserCount();
      expect(count).toBe(2);
      
      // Verify update
      const updatedUser = await userService.getUserById(1);
      expect(updatedUser.name).toBe('Updated User 1');
      
      // Delete a user
      await userService.deleteUser(2);
      
      count = await userService.getUserCount();
      expect(count).toBe(1);
      
      // Verify deletion
      const deletedUser = await userService.getUserById(2);
      expect(deletedUser).toBeNull();
    });
  });
});
