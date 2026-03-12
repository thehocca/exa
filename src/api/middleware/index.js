const crypto = require("crypto");

module.exports = (req, res, next) => {
  const signature = req.headers["x-operator-signature"];
  const secret = process.env.EXA_SECRET;

  if (!signature) {
    return res.status(200).json({ status: 4 }); // undefined error
  }

  const computed = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

  if (computed !== signature) {
    console.log("INVALID SIGNATURE");
    return res.status(200).json({ status: 4 });
  }

  next();
};
