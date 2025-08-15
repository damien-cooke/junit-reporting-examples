class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
    this.createdAt = new Date();
    this.isActive = true;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateAge(age) {
    return typeof age === 'number' && age >= 0 && age <= 150;
  }

  static validateName(name) {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
  }

  isAdult() {
    return this.age >= 18;
  }

  getDisplayName() {
    return this.name || 'Unknown User';
  }

  updateEmail(newEmail) {
    if (!User.validateEmail(newEmail)) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }

  updateAge(newAge) {
    if (!User.validateAge(newAge)) {
      throw new Error('Invalid age');
    }
    this.age = newAge;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      createdAt: this.createdAt,
      isActive: this.isActive,
      isAdult: this.isAdult()
    };
  }
}

module.exports = User;
