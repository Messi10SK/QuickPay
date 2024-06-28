const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");




dotenv.config()
const jwtsecret = process.env.JWT_SECRET


const authMid = async(req,res,next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            message: "invalid Token",
        })
}


const token = authHeader.split(' ')[1];

try {
    const decoded = jwt.verify(token ,jwtsecret);
    if(decoded){
        req.userId = decoded.userId
        next();
    }
} catch (error) {
    return res.status(403).json({});
}

}

module.exports = {
    authMid 
}