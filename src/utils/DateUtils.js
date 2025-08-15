const moment = require('moment');

class DateUtils {
  static formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) {
      throw new Error('Date is required');
    }
    return moment(date).format(format);
  }

  static addDays(date, days) {
    if (!date) {
      throw new Error('Date is required');
    }
    if (typeof days !== 'number') {
      throw new Error('Days must be a number');
    }
    return moment(date).add(days, 'days').toDate();
  }

  static subtractDays(date, days) {
    if (!date) {
      throw new Error('Date is required');
    }
    if (typeof days !== 'number') {
      throw new Error('Days must be a number');
    }
    return moment(date).subtract(days, 'days').toDate();
  }

  static daysBetween(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Both start and end dates are required');
    }
    return moment(endDate).diff(moment(startDate), 'days');
  }

  static isWeekend(date) {
    if (!date) {
      throw new Error('Date is required');
    }
    const day = moment(date).day();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  static getBusinessDays(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Both start and end dates are required');
    }
    
    let count = 0;
    const current = moment(startDate);
    const end = moment(endDate);
    
    while (current.isSameOrBefore(end)) {
      if (!this.isWeekend(current.toDate())) {
        count++;
      }
      current.add(1, 'day');
    }
    
    return count;
  }

  static isValidDate(date) {
    return moment(date).isValid();
  }

  static getAge(birthDate) {
    if (!birthDate) {
      throw new Error('Birth date is required');
    }
    return moment().diff(moment(birthDate), 'years');
  }

  static getQuarter(date) {
    if (!date) {
      throw new Error('Date is required');
    }
    return moment(date).quarter();
  }

  static startOfMonth(date) {
    if (!date) {
      throw new Error('Date is required');
    }
    return moment(date).startOf('month').toDate();
  }

  static endOfMonth(date) {
    if (!date) {
      throw new Error('Date is required');
    }
    return moment(date).endOf('month').toDate();
  }
}

module.exports = DateUtils;
