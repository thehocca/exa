const UsersSchema = require("./Users.model/index");
const { connections } = require("../services/db");

module.exports = connections["TipCoin"].model("users", UsersSchema);
