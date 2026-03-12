const md5 = require("md5");
function ip(req) {
    return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0].replace('::ffff:', '');

}

module.exports={
ip,md5
}