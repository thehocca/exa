const f  = require("./fx");
const Bellek = require("./bellek");
const sanitizer = require('sanitizer');
const Protect  = (reqid,url='') => {
    //TODO :add - > Cron auto deleting
    if (Bellek.blockedRest[reqid+url]) {
        if (Bellek.blockedRest[reqid+url].upTime + (Bellek.blockedRest[reqid+url].wait * 1000) - new Date().getTime() < 0) {
            Bellek.blockedRest[reqid+url].upTime = new Date().getTime() + 200;
            Bellek.blockedRest[reqid+url].counter += 1;
            Bellek.blockedRest[reqid+url].wait = 0;
            Bellek.blockedRest[reqid+url].remain = Bellek.blockedRest[reqid+url].upTime + (Bellek.blockedRest[reqid+url].wait * 1000) - new Date().getTime();
            return false;
        } else {
            Bellek.blockedRest[reqid+url].counter = 0;
            Bellek.blockedRest[reqid+url].wait += 2;
            return {
                'blocked': true,
                'openSec': Bellek.blockedRest[reqid+url].upTime + (Bellek.blockedRest[reqid+url].wait * 1000) - new Date().getTime()
            };
        }
    } else {
        Bellek.blockedRest[reqid+url] = {'upTime': new Date().getTime(), 'wait': 0, 'counter': 0};
        return false;
    }
}
const  sanitizeNestedObjects =  (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            // Eğer obje alt bir JSON objesi ise, özyinelemeyi kullanarak alt objeyi sanitize edelim
            obj[key] = sanitizeNestedObjects(obj[key]);
        } else {
            // Diğer durumlarda, tekil değeri sanitize edelim
            obj[key] = sanitizer.sanitize(obj[key]);
        }
    }
    return obj;
}
exports.AttackBlokade = async(req,res,next) => {
    let PROTECT = await Protect(f.ip(req),f.md5(req.originalUrl));
   // req.body = sanitizeNestedObjects(req.body);

    for (const key in req.query) {
        req.query[key] = sanitizer.sanitize(req.query[key]);
    }
    for (const key in req.params) {
        req.params[key] = sanitizer.sanitize(req.params[key]);
    }
    if(typeof PROTECT ==='object'){
        return res.status(403).json({
            blocked: true,
            success: false,
            openSec: PROTECT.openSec,
            message:"Your Request Temporary Banned (No permission)"
        });
    }
    next();
};
