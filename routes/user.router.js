
const {getAllUsers, getUserById,register, createUser, updateUser,deleteUser,login, forgotPassword,resetPassword} = require('../controllers/user.controller');
const {createPollWithOptions,getAllPolls,getPollById} = require('../controllers/polls.controller');
const {addOption,updateOption} = require('../controllers/options.controller');
const {validateRegisterRequest,validateLoginRequest} = require('../middleware/user.validation.middleware');
const authenticate = require('../middleware/authenticate.middleware');
const authenticateToken = require('../middleware/token.validate.middleware');
const express = require('express');
const user_router = express.Router();

user_router.get('/users', getAllUsers);

user_router.get('/user/:id', getUserById);

user_router.post('/auth/login', validateLoginRequest,login);

user_router.post('/register', validateRegisterRequest,register);

user_router.post('/createUser',validateRegisterRequest,authenticate,createUser);

user_router.put('/updateUser/:id', updateUser);

user_router.delete('/deleteUser/:id', deleteUser);

user_router.post('/createPoll',authenticate, createPollWithOptions);

user_router.get('/polls', getAllPolls);

// user_router.get('/poll/:id', getPollById);

user_router.post('/addOption',authenticate, addOption);

user_router.put('/editOption',authenticate, updateOption);
// user_router.post('/forgotPassword', forgotPassword);
// user_router.post('/resetPassword', resetPassword);

module.exports = user_router;
