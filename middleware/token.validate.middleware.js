const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req,res,next) => {

const {authorization}   = req.headers;
    if(authorization){
        const token = authorization.split(" ")[1];
        const {key} = req
        try{
            const isValid = json
            webtoken.verify(token,key,{algorithm: 'HS256'})
        if(isValid){
            res.locals.userToken = isValid;
            return next();
        }
        }catch(err){
            return res.status(401).json({message: 'Unauthorized'});
        }
    }
    return res.status(401).json({message: 'Unauthorized'}); 

  }

module.exports = authenticateToken;

