const Joi = require('joi');
const balanceRes = require('./basic/balanceRes')

const balanceReq = Joi.object({
  MemberName: Joi.string().required(),
  OperatorCode: Joi.string().required(),
  ProductID: Joi.number().integer().required(),
  MessageID: Joi.string().required(),
  Sign: Joi.string().required(),
  RequestTime: Joi.string().length(14).required(), 
});


module.exports = {
  balanceReq,
  balanceRes
};
