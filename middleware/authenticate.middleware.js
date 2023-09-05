const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
   const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      if (!token) {
         return res.status(401).json({ error: 'Unauthorized' });
         }
      else {
         try{
            const claims = jwt.verify(token, process.env.JWT_SECRET);
            req.session = claims;
            next();
         }
      catch (err) {
         return res.status(401).json({ error: 'Invalid token' });
      }
   }
   
 };
 
module.exports = authenticate;

