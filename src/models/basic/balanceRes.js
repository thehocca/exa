const Joi = require('joi');


const balanceResponse = Joi.object({
    ErrorCode: Joi.number().integer().required(),
    ErrorMessage: Joi.string().required(),
    Balance: Joi.number().precision(4).required(),
    BeforeBalance: Joi.number().precision(4).required(),
    // Include any other response parameters here
});

module.exports = balanceResponse;
