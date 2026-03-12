class PlatformCodes {
    static get codes() {
      return {
        0: 'Web',
        1: 'Mobile',
      };
    }
  
    static getDescription(code) {
      return this.codes[code] || 'Unknown platform code';
    }
  }
  
  