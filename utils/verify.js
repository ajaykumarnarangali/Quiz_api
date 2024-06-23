const jwt = require('jsonwebtoken');
const {errorHandler}=require('./errorHandler');

module.exports.verify = (req, res, next) => {
    try {
        const token=req.cookies.access_token;
        if(!token)
        {
            return next(errorHandler(401,"Unauthorized"));
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err)
            {
                return next(errorHandler(401,"Unauthorized"));
            }
            req.user=decoded;
            next();
        })

    } catch (error) {
       next(error)
    }
}