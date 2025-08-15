const User = require('../models/User');

class UserService {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async createUser(name, email, age) {
    // Simulate async operation
    await this.delay(10);
    
    if (!User.validateName(name)) {
      throw new Error('Invalid name');
    }
    if (!User.validateEmail(email)) {
      throw new Error('Invalid email');
    }
    if (!User.validateAge(age)) {
      throw new Error('Invalid age');
    }
    
    // Check if email already exists
    for (const user of this.users.values()) {
      if (user.email === email) {
        throw new Error('Email already exists');
      }
    }
    
    const user = new User(this.nextId++, name, email, age);
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id) {
    await this.delay(5);
    return this.users.get(id) || null;
  }

  async getUserByEmail(email) {
    await this.delay(5);
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers() {
    await this.delay(10);
    return Array.from(this.users.values());
  }

  async getActiveUsers() {
    await this.delay(10);
    return Array.from(this.users.values()).filter(user => user.isActive);
  }

  async updateUser(id, updates) {
    await this.delay(5);
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (updates.email && !User.validateEmail(updates.email)) {
      throw new Error('Invalid email');
    }
    if (updates.age && !User.validateAge(updates.age)) {
      throw new Error('Invalid age');
    }
    if (updates.name && !User.validateName(updates.name)) {
      throw new Error('Invalid name');
    }
    
    Object.assign(user, updates);
    return user;
  }

  async deleteUser(id) {
    await this.delay(5);
    const deleted = this.users.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
    return true;
  }

  async getUserCount() {
    await this.delay(5);
    return this.users.size;
  }

  async getAdultUsers() {
    await this.delay(10);
    return Array.from(this.users.values()).filter(user => user.isAdult());
  }

  async searchUsers(query) {
    await this.delay(15);
    const lowerQuery = query.toLowerCase();
    return Array.from(this.users.values()).filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
  }

  // Helper method to simulate async operations
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method for testing error scenarios
  async simulateError() {
    await this.delay(5);
    throw new Error('Simulated error for testing');
  }

  // Method that sometimes fails (for flaky test simulation)
  async flakyOperation() {
    await this.delay(10);
    if (Math.random() < 0.3) { // 30% chance of failure
      throw new Error('Flaky operation failed');
    }
    return 'Success';
  }
}

module.exports = UserService;
