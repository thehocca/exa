
const Joi = require('joi');

const LaunchGamePayload = Joi.object({
    UserID: Joi.string().required(),
    MemberName: Joi.string().required(),
    stakeFrom: Joi.string().required(),
    returnUrl: Joi.string().required(),
    DisplayName: Joi.string().required(),
    Password: Joi.string().required(),
    Currency: Joi.string().required(),
    GameID: Joi.string().required(),
    ProductID: Joi.string().required(), // Changed from number to string
    GameType: Joi.string().required(),
    LanguageCode: Joi.string().required(),
    IPAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required(), // Improved validation
    Platform: Joi.string().required() // Added Platform field
});

module.exports ={
     LaunchGamePayload
}


