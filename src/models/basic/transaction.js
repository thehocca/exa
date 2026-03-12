const Joi = require('joi');

const transactionSchema = Joi.object({
  MemberID: Joi.number().integer().required(),
  OperatorID: Joi.number().integer().required(),
  ProductID: Joi.number().integer().required(),
  ProviderId: Joi.number().integer().required(),
  ProviderLineID: Joi.string().required(),
  WagerID: Joi.string().allow(null),
  CurrencyID: Joi.number().integer().required(),
  GameType: Joi.number().integer().required(),
  GameID: Joi.string().required(),
  GameRoundID: Joi.string().allow(null),
  BetAmount: Joi.number().precision(2).allow(null),
  ValidBetAmount: Joi.number().precision(2).required(),
  Fee: Joi.number().precision(2).allow(null),
  JPBet: Joi.number().precision(2).allow(null),
  PayoutAmount: Joi.number().precision(2).allow(null),
  CommissionAmount: Joi.number().precision(2).allow(null),
  JackpotAmount: Joi.number().precision(2).allow(null),
  PayoutDetail: Joi.string().allow(null),
  Data: Joi.object().allow(null),
  Status: Joi.number().integer().required(),
  CreatedOn: Joi.string().required(),
  ModifiedOn: Joi.string().required(),
  SettlementDate: Joi.date().allow(null),
  TransactionID: Joi.string().allow(null),
  TransactionAmount: Joi.number().precision(2).required()
});

module.exports = transactionSchema;
