class StatusCodes {
    static get codes() {
      return {
        100: 'Pending',
        101: 'Settle',
        102: 'Void',
      };
    }
  
    static getDescription(code) {
      return this.codes[code] || 'Unknown status code';
    }
  }
  
  module.exports = StatusCodes;
  