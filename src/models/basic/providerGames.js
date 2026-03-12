const Joi = require('joi');

const providerGamesSchema = Joi.object({
  gameCode: Joi.string().required(),
  gameName: Joi.string().required(),
  gameType: Joi.number().integer().allow(null),
  category: Joi.string().default('Games').allow(null),
  imageURL: Joi.string().uri().allow(null),
  providerGameType: Joi.string().allow(null),
});

module.exports = providerGamesSchema;
