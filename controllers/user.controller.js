const knex = require('../db/knex');
const { hashPassword, checkHashPassword } = require('../helpers/hash');
const jwt = require('jsonwebtoken');
const {mailService} = require('../services/mail.service');
// const {getOne,getMany,executeQuery,updateOne,} = require('../db/query');
const crypto = require('crypto');

// const getAllUsers = function (req, res) {
//     const page =(req.query.page); 
//     const limit = (req.query.limit) || 3;
//     const search = req.query.search || ''; 
    
//     if (page) {
//       const offset = (page - 1) * limit; // Calculate the offset
//       knex('users')
//         .select()
//         .count('id as total')
//         .where(builder => {
//           if (search) {
//             builder
//               .where('username', 'like', `%${search}%`)
//               .orWhere('name', 'like', `%${search}%`);
//           }
//         })
//         .limit(limit)
//         .offset(offset)
//         .then(function (users) {
//           res.send(users);
//         })
//         .catch(err => {
//           console.error(err); 
//           return res.status(500).json({ error: 'Internal server error' });
//         });
//     } else {
//       knex('users')
//         .select()
//         .where(builder => {
//           if (search) {
//             builder
//               .where('username', 'like', `%${search}%`)
//               .orWhere('name', 'like', `%${search}%`);
//           }
//         })
//         .then(function (users) {
//           res.send(users);
          
//         })
//         .catch(err => {
//           console.error(err); 
//           return res.status(500).json({ error: 'Internal server error' });
//         });
//     }
//   };
// test
const getAllUsers = function (req, res) {
    const page = req.query.page;
    const limit = req.query.limit || 3;
    const search = req.query.search || '';

    // Tính toán offset dựa trên trang và giới hạn
    const offset = page ? (page - 1) * limit : 0;

    const query = knex('users')
        .select()
        .where((builder) => {
            if (search) {
                builder
                    .where('username', 'like', `%${search}%`)
                    .orWhere('name', 'like', `%${search}%`);
            }
        });

    if (page) {
        query
            .clone()
            .count('id as total')
            .then((result) => {
                const totalRecords = result[0].total;
                query
                    .clone()
                    .limit(limit)
                    .offset(offset)
                    .then(function (users) {
                        res.json({
                            totalRecords: totalRecords,
                            users: users,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).json({ error: 'Internal server error' });
                    });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            });
    } else {
        query
            .then(function (users) {
                res.json({
                    users: users,
                });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            });
    }
};

  
  
// get user by id
const getUserById = function (req, res) {
    knex('users').select().where('id', req.params.id).then(function (users) {
        res.send(users);
    }
    );
};
// register new user
const register = function (req, res) {
    const {
        username,
        password,
        confirmPassword, // New field for password confirmation
        name,
        age,
        email,
        gender,
    } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Password and confirmPassword do not match',
        });
    }

    // Check if the username is already in the database
    knex('users')
        .where('username', username)
        .then((rows) => {
            console.log(rows);
            if (rows.length > 0) {
                return res.status(400).json({
                    message: 'Username already exists',
                });
            } else {
                const { salt, hashedPassword } = hashPassword(password);
                const hashedPasswordString = hashedPassword.toString('base64');
                return knex('users')
                    .insert({
                        username: username,
                        password: hashedPasswordString,
                        salt: salt,
                        name: name,
                        age: age,
                        email: email,
                        gender: gender,
                    })
                    .then(() => {
                        return res.status(201).json({
                            message: 'User created successfully',
                        });
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        })
        .catch((err) => {
            throw err;
        });
};

// create new user after login
const createUser = function (req, res) {
    const {
        username,
        password,
        name,
        age,
        email,
        gender
    } = req.body;
    const createdBy = req.session.id;
    // check if the username is already in the database
    knex('users').where('username', username)
        .then(rows => {
            console.log(rows);
            if (rows.length > 0) {
                return res.status(400).json({
                    message: 'Username already exists'
                });
            } else {
                const { salt, hashedPassword } = hashPassword(password);
                const hashedPasswordString = hashedPassword.toString('base64');
                const newUser = {
                    username: username,
                    password: hashedPasswordString,
                    salt: salt,
                    name: name,
                    age: age,
                    email: email,
                    gender: gender,
                    created_by: createdBy 
                };
                return knex('users').insert(newUser).then(() => {
                    return newUser;
                }).then((user) => {
                    // Create a new token for the registered user
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                    // Attach the token to the response header
                    res.setHeader('Authorization', `Bearer ${token}`);
                    return res.status(201).json({
                        message: 'User created successfully'
                    });
                }).catch(err => {
                    throw err;
                });
            }
        })
        .catch(err => {
            throw err;
        });
}

// update user
const updateUser = function (req, res) {
    const id = req.params.id; 
    const {
        username,
        password = '', 
        name,
        age,
        email,
        gender
    } = req.body;

    knex('users')
        .where('id', id)
        .then(result => {
            if (result.length === 0) {
                return res.status(400).json({ error: 'User not found' });
            }
            // if have change password
            if (password) {
                const { salt, hashedPassword } = hashPassword(password);
                const hashedPasswordString = hashedPassword.toString('base64');
                knex('users')
                    .where('id', id)
                    .update({
                        username: username,
                        password: hashedPasswordString,
                        salt: salt,
                        name: name,
                        age: age,
                        email: email,
                        gender: gender
                    })
                    .then(() => {
                        return res.status(200).json({
                            message: 'User updated successfully'
                        });
                    })
                    .catch(err => {
                        console.error(err); 
                        return res.status(500).json({ error: 'Internal server error' });
                    });
            } else {
                knex('users')
                    .where('id', id)
                    .update({
                        username: username,
                        name: name,
                        age: age,
                        email: email,
                        gender: gender
                    })
                    .then(() => {
                        return res.status(200).json({
                            message: 'User updated successfully'
                        });
                    })
                    .catch(err => {
                        console.error(err); 
                        return res.status(500).json({ error: 'Internal server error' });
                    });
            }
        })
        .catch(err => {
            console.error(err); 
            return res.status(500).json({ error: 'Internal server error' });
        });
};

// delete user
const deleteUser = function (req, res) {
    knex('users').where('id', req.params.id).del().then(function () {
        res.send('user deleted');
    }
    );
}


// login
const login = (req, res) => {
    const { username, password } = req.body;
    knex('users').where('username', username)
        .then(rows => {
            if (rows.length > 0) {
                const user = rows[0];
                const hashedPassword = checkHashPassword(password, user.salt);
                if (hashedPassword.toString('base64') === user.password) {
                    const secretKey = process.env.JWT_SECRET || "";
                    const token = jwt.sign({ id: user.id, name: username.name }, secretKey, { expiresIn: '24h' });
                    return res.status(200).json({
                        message: 'Login successful',
                        token
                    });
                } else {
                    return res.status(400).json({
                        message: 'Wrong password'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'User not found'
                });
            }
        })
        .catch(err => {
            throw err;
        });
}

// send email by nodemailer
// const sendEmail = (req, res) => {
//     const { email, subject, text } = req.body;
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_ADDRESS,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
//     const mailOptions = {
//         from: process.env.EMAIL_ADDRESS,
//         to: email,
//         subject: subject,
//         text: text
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//             return res.status(400).json({
//                 message: 'Email not sent'
//             });
//         } else {
//             console.log('Email sent: ' + info.response);
//             return res.status(200).json({
//                 message: 'Email sent'
//             });
//         }
//     });
// }
// const sendEmail = (req, res) => {
//     const { emailFrom, emailTo, emailSubject, emailText } = req.body;
//     try{

//     }
    
// }

// forgot password
// const forgotPassword = async (req, res) => {
//     try {
//       const { email } = req.body;
  
//       const user = await getOne({
//         query: 'SELECT * FROM users WHERE email = ?',
//         params: [email],
//       });
  
//       if (!user) {
//         return res.status(400).json({
//           message: 'Email not found',
//         });
//       }
  
//       const secretKey = crypto.randomBytes(32).toString('hex');
//       const passwordResetToken = crypto.createHash('sha256').update(secretKey).digest('hex');
  
//       const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
  
//       const updateStatus = await updateOne({
//         query: 'UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?',
//         params: [passwordResetToken, passwordResetExpiration, email],
//       });
  
//       if (updateStatus) {
//         mailService.sendEmail({
//           emailFrom: 'smtp.gmail.com',
//           emailTo: email,
//           emailSubject: 'Reset password',
//           emailText: 'Here is your reset password token: ' + passwordResetToken,
//         });
  
//         return res.status(200).json({
//           message: 'Reset password email sent successfully',
//         });
//       }
  
//       return res.status(400).json({
//         message: "Can't reset password!",
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       return res.status(500).json({
//         message: 'Internal server error',
//       });
//     }
//   };

// // reset password
// const resetPassword = async (req, res) => {
//     try {
//       const { email, passwordResetToken, newPassword } = req.body;
      
//       // Kiểm tra xem có người dùng phù hợp với email và token không hết hạn
//       const user = await knex('users')
//         .where('email', email)
//         .where('passwordResetToken', passwordResetToken)
//         .where('passwordResetExpiration', '>=', new Date())
//         .first();
  
//       if (!user) {
//         return res.status(400).json({
//           message: 'Invalid token or token has expired',
//         });
//       }
  
//       // Tạo salt và hash mới cho mật khẩu
//       const salt = crypto.randomBytes(32).toString('hex');
//       const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 10, 64, `sha512`).toString(`hex`);
  
//       // Cập nhật mật khẩu mới và thông tin liên quan trong CSDL
//       const updateStatus = await knex('users')
//         .where('email', email)
//         .update({
//           password: hashedPassword,
//           salt: salt,
//           passwordResetToken: null,
//           passwordResetExpiration: null,
//           passwordLastResetDate: new Date(),
//         });
  
//       if (updateStatus) {
//         return res.status(200).json({
//           message: 'Reset password successfully',
//         });
//       }
  
//       return res.status(400).json({
//         message: 'Reset password failed',
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error',
//       });
//     }
//   };
  

module.exports = {
    getAllUsers,
    getUserById,
    register,
    createUser,
    updateUser,
    deleteUser,
    login,
    // sendEmail,
    // forgotPassword,
    // resetPassword

}

