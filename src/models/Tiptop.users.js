const UsersSchema = require("./Users.model/index");
const { connections } = require("../services/db");

module.exports = connections["Tiptop"].model("users", UsersSchema);
