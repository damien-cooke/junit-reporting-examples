const DateUtils = require('../../src/utils/DateUtils');

describe('DateUtils Unit Tests', () => {
  
  describe('Date Formatting', () => {
    test('should format date with default format', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.formatDate(date);
      expect(result).toBe('2023-12-25');
    });

    test('should format date with custom format', () => {
      const date = new Date('2023-12-25T10:30:00');
      const result = DateUtils.formatDate(date, 'DD/MM/YYYY HH:mm');
      expect(result).toBe('25/12/2023 10:30');
    });

    test('should handle string dates', () => {
      const result = DateUtils.formatDate('2023-12-25', 'YYYY-MM-DD');
      expect(result).toBe('2023-12-25');
    });

    test('should throw error for null date', () => {
      expect(() => DateUtils.formatDate(null)).toThrow('Date is required');
    });

    test('should throw error for undefined date', () => {
      expect(() => DateUtils.formatDate(undefined)).toThrow('Date is required');
    });
  });

  describe('Date Addition', () => {
    test('should add days correctly', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.addDays(date, 5);
      expect(result).toEqual(new Date('2023-12-30'));
    });

    test('should handle negative days (subtraction)', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.addDays(date, -5);
      expect(result).toEqual(new Date('2023-12-20'));
    });

    test('should handle zero days', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.addDays(date, 0);
      expect(result).toEqual(date);
    });

    test('should throw error for null date', () => {
      expect(() => DateUtils.addDays(null, 5)).toThrow('Date is required');
    });

    test('should throw error for non-number days', () => {
      const date = new Date('2023-12-25');
      expect(() => DateUtils.addDays(date, '5')).toThrow('Days must be a number');
    });
  });

  describe('Date Subtraction', () => {
    test('should subtract days correctly', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.subtractDays(date, 5);
      expect(result).toEqual(new Date('2023-12-20'));
    });

    test('should handle negative days (addition)', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.subtractDays(date, -5);
      expect(result).toEqual(new Date('2023-12-30'));
    });

    test('should throw error for null date', () => {
      expect(() => DateUtils.subtractDays(null, 5)).toThrow('Date is required');
    });

    test('should throw error for non-number days', () => {
      const date = new Date('2023-12-25');
      expect(() => DateUtils.subtractDays(date, '5')).toThrow('Days must be a number');
    });
  });

  describe('Days Between Calculation', () => {
    test('should calculate days between dates correctly', () => {
      const startDate = new Date('2023-12-20');
      const endDate = new Date('2023-12-25');
      const result = DateUtils.daysBetween(startDate, endDate);
      expect(result).toBe(5);
    });

    test('should handle reverse order dates', () => {
      const startDate = new Date('2023-12-25');
      const endDate = new Date('2023-12-20');
      const result = DateUtils.daysBetween(startDate, endDate);
      expect(result).toBe(-5);
    });

    test('should handle same dates', () => {
      const date = new Date('2023-12-25');
      const result = DateUtils.daysBetween(date, date);
      expect(result).toBe(0);
    });

    test('should throw error for null start date', () => {
      const endDate = new Date('2023-12-25');
      expect(() => DateUtils.daysBetween(null, endDate)).toThrow('Both start and end dates are required');
    });

    test('should throw error for null end date', () => {
      const startDate = new Date('2023-12-25');
      expect(() => DateUtils.daysBetween(startDate, null)).toThrow('Both start and end dates are required');
    });
  });

  describe('Weekend Detection', () => {
    test('should identify Saturday as weekend', () => {
      const saturday = new Date('2023-12-23'); // Saturday
      const result = DateUtils.isWeekend(saturday);
      expect(result).toBe(true);
    });

    test('should identify Sunday as weekend', () => {
      const sunday = new Date('2023-12-24'); // Sunday
      const result = DateUtils.isWeekend(sunday);
      expect(result).toBe(true);
    });

    test('should identify weekdays as non-weekend', () => {
      const monday = new Date('2023-12-25'); // Monday
      const result = DateUtils.isWeekend(monday);
      expect(result).toBe(false);
    });

    test('should throw error for null date', () => {
      expect(() => DateUtils.isWeekend(null)).toThrow('Date is required');
    });
  });

  describe('Business Days Calculation', () => {
    test('should calculate business days excluding weekends', () => {
      const startDate = new Date('2023-12-18'); // Monday
      const endDate = new Date('2023-12-22'); // Friday
      const result = DateUtils.getBusinessDays(startDate, endDate);
      expect(result).toBe(5); // Mon, Tue, Wed, Thu, Fri
    });

    test('should exclude weekends from business days', () => {
      const startDate = new Date('2023-12-22'); // Friday
      const endDate = new Date('2023-12-26'); // Tuesday
      const result = DateUtils.getBusinessDays(startDate, endDate);
      expect(result).toBe(3); // Friday, Monday, Tuesday
    });

    test('should handle single day range', () => {
      const monday = new Date('2023-12-25'); // Monday
      const result = DateUtils.getBusinessDays(monday, monday);
      expect(result).toBe(1);
    });

    test('should handle weekend range', () => {
      const saturday = new Date('2023-12-23'); // Saturday
      const sunday = new Date('2023-12-24'); // Sunday
      const result = DateUtils.getBusinessDays(saturday, sunday);
      expect(result).toBe(0);
    });

    test('should throw error for null dates', () => {
      const date = new Date('2023-12-25');
      expect(() => DateUtils.getBusinessDays(null, date)).toThrow('Both start and end dates are required');
      expect(() => DateUtils.getBusinessDays(date, null)).toThrow('Both start and end dates are required');
    });
  });

  describe('Date Validation', () => {
    test('should validate valid dates', () => {
      expect(DateUtils.isValidDate('2023-12-25')).toBe(true);
      expect(DateUtils.isValidDate(new Date())).toBe(true);
      expect(DateUtils.isValidDate('2023-02-28')).toBe(true);
    });

    test('should invalidate invalid dates', () => {
      expect(DateUtils.isValidDate('invalid-date')).toBe(false);
      expect(DateUtils.isValidDate('2023-13-01')).toBe(false); // Invalid month
      expect(DateUtils.isValidDate('2023-02-30')).toBe(false); // Invalid day
    });

    test('should handle null and undefined', () => {
      expect(DateUtils.isValidDate(null)).toBe(false);
      expect(DateUtils.isValidDate(undefined)).toBe(false);
    });
  });

  describe('Age Calculation', () => {
    test('should calculate age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const age = DateUtils.getAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(33); // Assuming current year is 2023 or later
    });

    test('should handle recent birth dates', () => {
      const recentBirthDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      const age = DateUtils.getAge(recentBirthDate);
      expect(age).toBe(1);
    });

    test('should throw error for null birth date', () => {
      expect(() => DateUtils.getAge(null)).toThrow('Birth date is required');
    });
  });

  describe('Quarter Calculation', () => {
    test('should identify quarters correctly', () => {
      expect(DateUtils.getQuarter(new Date('2023-01-15'))).toBe(1);
      expect(DateUtils.getQuarter(new Date('2023-04-15'))).toBe(2);
      expect(DateUtils.getQuarter(new Date('2023-07-15'))).toBe(3);
      expect(DateUtils.getQuarter(new Date('2023-10-15'))).toBe(4);
    });

    test('should handle edge cases', () => {
      expect(DateUtils.getQuarter(new Date('2023-03-31'))).toBe(1); // End of Q1
      expect(DateUtils.getQuarter(new Date('2023-04-01'))).toBe(2); // Start of Q2
    });

    test('should throw error for null date', () => {
      expect(() => DateUtils.getQuarter(null)).toThrow('Date is required');
    });
  });

  describe('Month Boundaries', () => {
    test('should get start of month correctly', () => {
      const date = new Date('2023-12-15');
      const result = DateUtils.startOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(11); // December (0-indexed)
    });

    test('should get end of month correctly', () => {
      const date = new Date('2023-12-15');
      const result = DateUtils.endOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(11); // December (0-indexed)
    });

    test('should handle February correctly', () => {
      const date = new Date('2023-02-15');
      const endOfMonth = DateUtils.endOfMonth(date);
      expect(endOfMonth.getDate()).toBe(28); // 2023 is not a leap year
    });

    test('should handle leap year February', () => {
      const date = new Date('2024-02-15');
      const endOfMonth = DateUtils.endOfMonth(date);
      expect(endOfMonth.getDate()).toBe(29); // 2024 is a leap year
    });

    test('should throw error for null date in start of month', () => {
      expect(() => DateUtils.startOfMonth(null)).toThrow('Date is required');
    });

    test('should throw error for null date in end of month', () => {
      expect(() => DateUtils.endOfMonth(null)).toThrow('Date is required');
    });
  });
});
