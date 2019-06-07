const express = require('express');
const asyncHandler = require('express-async-handler');
const usersCtrl = require('../controllers/users.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(registerUser), loginUser);
router.post('/login', passport.authenticate('local', { session: false }), loginUser);
router.post('/logout', asyncHandler(logoutUser));

async function registerUser(req, res, next) {
  let user = await usersCtrl.insert(req.body);
  user = user.toObject();
  delete user.password;
  delete user.appointments;
  delete user.invites;
  req.user = user;
  next()
}

async function loginUser(req, res) {
  let user = req.user;
  let token = usersCtrl.generateToken(user);
  res.json({ user, token });
}

async function logoutUser(req, res) {
  req.logout();
}