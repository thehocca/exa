const transactionSchema = require('./basic/transaction')
const gameResultBalanceRes = require('./basic/balanceRes')

const Joi = require('joi');

const gameResultReq = Joi.object({
    MemberName: Joi.string().required(),
    OperatorCode: Joi.string().required(),
    ProductID: Joi.number().integer().required(),
    MessageID: Joi.string().required(),
    RequestTime: Joi.string().required(), // For more strict validation, use Joi.date().iso() if the format is ISO 8601
    Sign: Joi.string().required(),
    Transactions: Joi.array().items(
        transactionSchema
    ).required()
});

module.exports = {
    gameResultReq,
    gameResultBalanceRes
};
