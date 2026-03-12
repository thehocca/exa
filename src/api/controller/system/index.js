const { v1: uuidv1 } = require('uuid');


const healthcheck= async(req,res,next)=>{
    console.log("Getting time...")
    return res.status(200).json({
        "statusCode": 200,
        "body": {random:uuidv1()},
        "time": new Date()
    });
};

module.exports = {
    healthcheck
}