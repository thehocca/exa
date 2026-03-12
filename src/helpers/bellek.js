class CAHCES {
    constructor() {
        this._BASKET = {};
        this.blockedRest = {};
    }
    exists(key = false){
        return  key && this._BASKET[key] ? true : false
    }
    set(key, value, exp = 1000) {
        this._BASKET[key] = {'val': value, 'expires': exp,"exp_date":Date.now()+exp};
        setTimeout(() => this.del(key), exp)
    };

    async del(key) {
        console.info(this._BASKET[key]," deleted")
        return delete this._BASKET[key]
    };

    get(key) {
        return this._BASKET[key];
    };
    take(key) {
        let t = this.get(key);
        this.del(key);
        return t;
    }
    setCode(key,code,exp = 100000){
        //100 sec
        if(this.exists(key,code) === false){
            this.set(key,code,exp);
        } return true;
    }
    async useCode(key,code){
        if(this.exists(key,code)){
            this.take(key);
            return true;
        }
        return false;
    }
    log (key=false){
        return key=== false ? console.info(JSON.stringify(this._BASKET)) :  console.log(JSON.stringify(this.get(key)));
    }
}

module.exports = new CAHCES();
