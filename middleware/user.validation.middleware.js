
function validateRegisterRequest(req, res, next) {
    const { username, password, email, gender, name, age, confirmPassword } = req.body;
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must have at least 3 characters' });
    }
    if (password.length < 3) {
      return res.status(400).json({ error: 'Password must have at least 3 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (gender !== true && gender !== false) {
      return res.status(400).json({ error: 'Gender must be true or false' });
    }
  
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must have at least 2 characters' });
    }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0) {
      return res.status(400).json({ error: 'Age must be a non-negative number' });
    }
    if(password != confirmPassword) {
      return res.status(400).json({ error: 'Confirm Password is not valid' });
    }
    next();
  }


const validateLoginRequest = (req,res,next) => {
    if (req.body.username && req.body.password) {
        return next();
    }
    return res.status(400).json({ message: 'Error validating' });
}
module.exports = {
    validateRegisterRequest,
    validateLoginRequest
}
