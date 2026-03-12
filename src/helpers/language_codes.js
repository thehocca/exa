class LanguageCode {
    static get codes() {
        return {
            1: 'English',
            2: 'Traditional Chinese',
            3: 'Simplify Chinese',
            4: 'Thai',
            5: 'Indonesia',
            6: 'Japanese',
            7: 'Korea',
            8: 'Vietnamese',
            9: 'Deutsch',
            10: 'Espanol',
            11: 'Francais',
            12: 'Russia',
            13: 'Portuguese',
            14: 'Burmese',
            15: 'Danish',
            16: 'Finnish',
            17: 'Italian',
            18: 'Dutch',
            19: 'Norwegian',
            20: 'Polish',
            21: 'Romanian',
            22: 'Swedish',
            23: 'Turkish',
            24: 'Bulgarian',
            25: 'Czech',
            26: 'Greek',
            27: 'Hungarian',
            28: 'Brazilian Portuguese',
            29: 'Slovak',
            30: 'Georgian',
            31: 'Latvian',
            32: 'Ukrainian',
            33: 'Estonian',
            34: 'Filipino',
            35: 'Cambodian',
            36: 'Lao',
            37: 'Malay',
            38: 'Cantonese',
            39: 'Tamil',
            40: 'Hindi',
            41: 'European Spanish',
            42: 'Azerbaijani',
            43: 'Brunei Darussalam',
            44: 'Croatian',
        };
    }

    static getDescription(code) {
        return this.codes[code] || 'Unknown language code';
    }
}

module.exports = LanguageCode;
