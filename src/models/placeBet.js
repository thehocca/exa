const transactionSchema = require('./basic/transaction')
const placeBetBalanceRes = require('./basic/balanceRes')

const Joi = require('joi');

const placeBetReq = Joi.object({
    MemberName: Joi.string().required(),
    OperatorCode: Joi.string().required(),
    ProductID: Joi.number().integer().required(),
    MessageID: Joi.string().required(),
    RequestTime: Joi.string().required(),
    Sign: Joi.string().required(),
    Transactions: Joi.object().allow(null)
});

module.exports = {
    placeBetReq,
    placeBetBalanceRes
};
