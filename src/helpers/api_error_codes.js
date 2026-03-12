class ApiErrorCodes {
    constructor() {
      this.errorCodes = {
        0: 'Success',
        16: 'Failed',
        19: 'API Error',
        20: 'Too Many Requests',
        999: 'Internal Server Error',
        1000: 'API Member Not Exists',
        1001: 'API member balance is insufficient',
        1002: 'API proxy key error',
        1003: 'Duplicate API transactions',
        1004: 'API signature is invalid',
        1005: 'API not getting game list',
        1006: 'API bet does not exist',
        2000: 'API product is under maintenance',
        2001: 'API Payload Wrong'

      };
    }
  
    getDescription(code) {
      return this.errorCodes[code] || 'Unknown error code';
    }
  }
  
  module.exports = ApiErrorCodes;
