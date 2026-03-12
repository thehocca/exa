function decimalCall2(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
};
const intHolderSchema = {
    type: Number, set: function (v) {
        return Math.round(v);
    }
}
const generate = (length = 11) => {
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return new Date().getMonth() + retVal + (new Date().getFullYear() - 2000);
}
const generatePin = () => {
    return generate(8) + "-" + generate(4) + "-" + generate(4) + "-" + generate(4) + "-" + generate(12);
}
function getMoney(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(parseFloat(value.toString()).toFixed(2));
    }
    return value;
}
function setMoney(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(parseFloat(value.toString()).toFixed(2));
    }
    return value;
}
function decimalCall(value) {
    if (typeof value !== 'undefined') {
        return parseFloat(parseFloat(value.toString()).toFixed(8));
    }
    return value;
}
const startDate = (d)=>{
    const ds = d.split('/')[1]+'.'+d.split('/')[0]+'.'+d.split('/')[2]
    return ds
}
module.exports = {
    decimalCall,getMoney,generate,intHolderSchema,decimalCall2,startDate,setMoney
}