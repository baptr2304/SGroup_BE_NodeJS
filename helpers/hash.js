const crypto = require('crypto');

const hashPassword = (input) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha1');
     return {
         salt,
         hashedPassword
     };
 
 }

 const checkHashPassword = (input, salt) => {
    const hash = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha1');
    return hash;
  };

module.exports = {
    hashPassword,
    checkHashPassword
};
