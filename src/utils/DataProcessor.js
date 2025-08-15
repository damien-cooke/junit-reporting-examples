const _ = require('lodash');

class DataProcessor {
  static processArray(data) {
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array');
    }
    
    return {
      sum: _.sum(data),
      average: _.mean(data),
      min: _.min(data),
      max: _.max(data),
      count: data.length,
      median: this.calculateMedian(data),
      mode: this.calculateMode(data)
    };
  }

  static calculateMedian(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    
    const sorted = _.sortBy(data);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  static calculateMode(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    
    const frequency = _.countBy(data);
    const maxFreq = _.max(Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
    
    return modes.length === data.length ? null : modes.map(x => isNaN(Number(x)) ? x : Number(x));
  }

  static filterData(data, predicate) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    if (typeof predicate !== 'function') {
      throw new Error('Predicate must be a function');
    }
    
    return data.filter(predicate);
  }

  static transformData(data, transformer) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    if (typeof transformer !== 'function') {
      throw new Error('Transformer must be a function');
    }
    
    return data.map(transformer);
  }

  static groupBy(data, key) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    return _.groupBy(data, key);
  }

  static sortData(data, field, order = 'asc') {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (order === 'desc') {
      return _.orderBy(data, [field], ['desc']);
    }
    return _.orderBy(data, [field], ['asc']);
  }

  static async processAsyncData(data, asyncProcessor) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    if (typeof asyncProcessor !== 'function') {
      throw new Error('Async processor must be a function');
    }
    
    return Promise.all(data.map(asyncProcessor));
  }

  static validateData(data, schema) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    const errors = [];
    data.forEach((item, index) => {
      Object.keys(schema).forEach(key => {
        if (schema[key].required && !(key in item)) {
          errors.push(`Missing required field '${key}' at index ${index}`);
        }
        if (key in item && typeof item[key] !== schema[key].type) {
          errors.push(`Invalid type for field '${key}' at index ${index}. Expected ${schema[key].type}, got ${typeof item[key]}`);
        }
      });
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = DataProcessor;
