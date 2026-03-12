const UsersSchema = require("./Users.model/index");
const { connections } = require("../services/db");

module.exports = connections["365"].model("users", UsersSchema);
