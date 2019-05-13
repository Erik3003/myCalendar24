const express = require('express');
const asyncHandler = require('express-async-handler');
const usersCtrl = require('../controllers/users.controller');

const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', asyncHandler(logoutUser))

async function registerUser(req, res) {
  let user = await usersCtrl.insert(req.body);
  res.json({ user, "Success": "true" });
}

async function loginUser(req, res) {
  //let username = req.params.username;
  let user = await usersCtrl.login(req, res)
  //res.json(username);
}

async function logoutUser(req, res) {
  //let username = req.params.username;
  let user = await usersCtrl.logout(req, res)
  //res.json(username);
}