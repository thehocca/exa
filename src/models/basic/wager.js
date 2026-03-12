const Joi = require('joi');

const wagerSchema = Joi.object({
  wagerId: Joi.number().integer().required(),
  memberName: Joi.string().required(),
  productId: Joi.number().integer().required(),
  gameType: Joi.number().integer().required(),
  currencyId: Joi.number().integer().required(),
  gameId: Joi.string().allow(null),
  gameRoundId: Joi.string().required(),
  validBetAmount: Joi.number().precision(2).required(),
  betAmount: Joi.number().precision(2).required(),
  jpBet: Joi.number().precision(2).allow(null),
  payoutAmount: Joi.number().precision(2).required(),
  commissionAmount: Joi.number().precision(2).allow(null),
  jackpotAmount: Joi.number().precision(2).allow(null),
  settlementDate: Joi.date().allow(null),
  status: Joi.number().integer().required(),
  createdOn: Joi.date().required(),
  modifiedOn: Joi.date().required(),
});

module.exports = wagerSchema;
