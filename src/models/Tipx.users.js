const UsersSchema = require("./Users.model/index");
const { connections } = require("../services/db");

module.exports = connections["Tipx"].model("users", UsersSchema);
