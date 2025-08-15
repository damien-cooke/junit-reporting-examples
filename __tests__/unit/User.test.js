const User = require('../../src/models/User');

describe('User Model Tests', () => {
  
  describe('User Creation', () => {
    test('should create user with valid data', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 25);
      
      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.age).toBe(25);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('should create user with minimum valid data', () => {
      const user = new User(1, 'A', 'a@b.c', 0);
      
      expect(user.name).toBe('A');
      expect(user.email).toBe('a@b.c');
      expect(user.age).toBe(0);
    });
  });

  describe('Email Validation', () => {
    test('should validate correct email formats', () => {
      expect(User.validateEmail('test@example.com')).toBe(true);
      expect(User.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(User.validateEmail('user+tag@example.org')).toBe(true);
      expect(User.validateEmail('123@numbers.com')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(User.validateEmail('invalid-email')).toBe(false);
      expect(User.validateEmail('missing@domain')).toBe(false);
      expect(User.validateEmail('@missing-local.com')).toBe(false);
      expect(User.validateEmail('double@@domain.com')).toBe(false);
      expect(User.validateEmail('')).toBe(false);
      expect(User.validateEmail(' ')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(User.validateEmail(null)).toBe(false);
      expect(User.validateEmail(undefined)).toBe(false);
      expect(User.validateEmail(123)).toBe(false);
    });
  });

  describe('Age Validation', () => {
    test('should validate correct ages', () => {
      expect(User.validateAge(0)).toBe(true);
      expect(User.validateAge(25)).toBe(true);
      expect(User.validateAge(150)).toBe(true);
      expect(User.validateAge(100)).toBe(true);
    });

    test('should reject invalid ages', () => {
      expect(User.validateAge(-1)).toBe(false);
      expect(User.validateAge(151)).toBe(false);
      expect(User.validateAge('25')).toBe(false);
      expect(User.validateAge(null)).toBe(false);
      expect(User.validateAge(undefined)).toBe(false);
      expect(User.validateAge(25.5)).toBe(false); // Non-integer ages might be invalid
    });
  });

  describe('Name Validation', () => {
    test('should validate correct names', () => {
      expect(User.validateName('John')).toBe(true);
      expect(User.validateName('John Doe')).toBe(true);
      expect(User.validateName('Jean-Pierre')).toBe(true);
      expect(User.validateName("O'Connor")).toBe(true);
      expect(User.validateName('A')).toBe(true); // Single character
    });

    test('should reject invalid names', () => {
      expect(User.validateName('')).toBe(false);
      expect(User.validateName('   ')).toBe(false); // Only whitespace
      expect(User.validateName(null)).toBe(false);
      expect(User.validateName(undefined)).toBe(false);
      expect(User.validateName(123)).toBe(false);
    });

    test('should reject names that are too long', () => {
      const longName = 'A'.repeat(101); // 101 characters
      expect(User.validateName(longName)).toBe(false);
    });

    test('should accept names at the length limit', () => {
      const maxLengthName = 'A'.repeat(100); // 100 characters
      expect(User.validateName(maxLengthName)).toBe(true);
    });
  });

  describe('Adult Status', () => {
    test('should identify adults correctly', () => {
      const adult = new User(1, 'John', 'john@example.com', 18);
      const olderAdult = new User(2, 'Jane', 'jane@example.com', 25);
      
      expect(adult.isAdult()).toBe(true);
      expect(olderAdult.isAdult()).toBe(true);
    });

    test('should identify minors correctly', () => {
      const minor = new User(1, 'Young', 'young@example.com', 17);
      const baby = new User(2, 'Baby', 'baby@example.com', 0);
      
      expect(minor.isAdult()).toBe(false);
      expect(baby.isAdult()).toBe(false);
    });
  });

  describe('Display Name', () => {
    test('should return name when available', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 25);
      expect(user.getDisplayName()).toBe('John Doe');
    });

    test('should return default when name is empty', () => {
      const user = new User(1, '', 'john@example.com', 25);
      expect(user.getDisplayName()).toBe('Unknown User');
    });

    test('should handle null name', () => {
      const user = new User(1, null, 'john@example.com', 25);
      expect(user.getDisplayName()).toBe('Unknown User');
    });
  });

  describe('Email Update', () => {
    test('should update email with valid format', () => {
      const user = new User(1, 'John', 'old@example.com', 25);
      user.updateEmail('new@example.com');
      
      expect(user.email).toBe('new@example.com');
    });

    test('should throw error for invalid email format', () => {
      const user = new User(1, 'John', 'old@example.com', 25);
      
      expect(() => user.updateEmail('invalid-email')).toThrow('Invalid email format');
      expect(user.email).toBe('old@example.com'); // Should remain unchanged
    });
  });

  describe('Age Update', () => {
    test('should update age with valid value', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      user.updateAge(30);
      
      expect(user.age).toBe(30);
    });

    test('should throw error for invalid age', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      
      expect(() => user.updateAge(-1)).toThrow('Invalid age');
      expect(() => user.updateAge(151)).toThrow('Invalid age');
      expect(user.age).toBe(25); // Should remain unchanged
    });
  });

  describe('User Activation/Deactivation', () => {
    test('should deactivate user', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      expect(user.isActive).toBe(true);
      
      user.deactivate();
      expect(user.isActive).toBe(false);
    });

    test('should activate user', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      user.deactivate();
      expect(user.isActive).toBe(false);
      
      user.activate();
      expect(user.isActive).toBe(true);
    });
  });

  describe('JSON Serialization', () => {
    test('should serialize to JSON correctly', () => {
      const user = new User(1, 'John Doe', 'john@example.com', 25);
      const json = user.toJSON();
      
      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('name', 'John Doe');
      expect(json).toHaveProperty('email', 'john@example.com');
      expect(json).toHaveProperty('age', 25);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('isActive', true);
      expect(json).toHaveProperty('isAdult', true);
    });

    test('should include adult status in JSON', () => {
      const minor = new User(1, 'Young', 'young@example.com', 16);
      const adult = new User(2, 'Adult', 'adult@example.com', 20);
      
      expect(minor.toJSON().isAdult).toBe(false);
      expect(adult.toJSON().isAdult).toBe(true);
    });

    test('should include creation date in JSON', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      const json = user.toJSON();
      
      expect(json.createdAt).toBeInstanceOf(Date);
      expect(json.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle creation with edge case values', () => {
      const user = new User(0, 'A', 'a@b.c', 0);
      
      expect(user.id).toBe(0);
      expect(user.name).toBe('A');
      expect(user.age).toBe(0);
    });

    test('should maintain state consistency', () => {
      const user = new User(1, 'John', 'john@example.com', 25);
      const originalEmail = user.email;
      const originalAge = user.age;
      
      // Try invalid updates
      try {
        user.updateEmail('invalid-email');
      } catch (e) {
        // Expected to fail
      }
      
      try {
        user.updateAge(-5);
      } catch (e) {
        // Expected to fail
      }
      
      // State should remain unchanged
      expect(user.email).toBe(originalEmail);
      expect(user.age).toBe(originalAge);
    });
  });
});
