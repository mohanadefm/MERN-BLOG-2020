const jwt        = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const User       = require("../models/users.models");

const verify_token = async (req,res,next) => {

  const headerToken = req.headers.authorization;
  if(!headerToken)
    return res.send({ ok:false, message:"1-Unauthenticated access!" });

  try{
    let tokenDecoded = await jwt.verify(headerToken, jwt_secret);
    if (!tokenDecoded)
      return res.send({ ok:false, message:"2-Unauthenticated access!" });
    const user = await User.findOne({ _id: tokenDecoded._id });
    if (!user)
     return res.send({ ok:false, message:"User now is not existed!" }); // http error code.
    req.user = user;
    next();
  }
  catch(e){
    return res.send({ ok:false, message:"3-Unauthenticated access!" });
  }

};

module.exports = { verify_token };