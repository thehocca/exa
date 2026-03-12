const {redisTiptopwin} = require('../../services/redisClient/tiptopwin_redis');
const {redis365} = require('../../services/redisClient/365_redis');
const {redisTipx} = require('../../services/redisClient/tipx_redis');
const {redisTipCoin} = require('../../services/redisClient/tipcoin_redis');
const {redisStarwin} = require('../../services/redisClient/starwin_redis');

module.exports={redisTiptopwin,redis365,redisTipx,redisTipCoin,redisStarwin}
