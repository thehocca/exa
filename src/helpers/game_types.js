class GameType {
    static get types() {
      return {
        1: 'Slot',
        2: 'Live Casino',
        3: 'Sport Book',
        4: 'Virtual Sport',
        5: 'Lottery',
        6: 'Qipai',
        7: 'P2P',
        8: 'Fishing',
        9: 'Others',
        10: 'Cock Fighting',
        11: 'Bonus',
        12: 'Jackpot',
        13: 'ESport',
      };
    }
  
    static getDescription(code) {
      return this.types[code] || 'Unknown game type';
    }
  }
  
  module.exports = GameType;
  