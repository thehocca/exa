class Maths {
    add(x, y) {
        this.checkNumberType(x, y);
        return parseFloat(parseFloat(parseFloat(x) + parseFloat(y)).toFixed(2));
    }

    subt(x, y) {
        this.checkNumberType(x, y);
        return parseFloat(parseFloat(parseFloat(x) - parseFloat(y)).toFixed(2));
    }

    div(x, y) {
        this.checkNumberType(x, y);
        if (y === 0) {
            throw new Error('Divisor cannot be zero.');
        }
        return parseFloat(parseFloat(parseFloat(x) / parseFloat(y)).toFixed(2));
    }

    mult(x, y) {
        this.checkNumberType(x, y);
        return parseFloat(parseFloat(parseFloat(x) * parseFloat(y)).toFixed(2));
    }

    checkNumberType(...numbers) {
        for (const num of numbers) {
            if (typeof num !== 'number') {
                throw new Error('Non-numeric value cannot be used. '+typeof num);
            }
        }
    }
}

module.exports=new Maths()

