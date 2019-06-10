const express = require('express');
const asyncHandler = require('express-async-handler');
const usersCtrl = require('../controllers/users.controller');
const passport = require('passport');

const router = express.Router();
module.exports = router;

// User-Routen setzen:
// Register-Route registriert Nutzer erst und generiert dann Token
router.post('/register', asyncHandler(registerUser), loginUser);
// Login-Route Autentifiziert den Nutzer erst mit dem nicht-Token basierten Verfahren und generiert dann Token
router.post('/login', passport.authenticate('local', { session: false }), loginUser);
// Logout-Route
router.post('/logout', asyncHandler(logoutUser));
// Route um Nutzernamen von Nutzer(id) zu erhalten
router.post('/username', asyncHandler(getUsername));

// Token-Authentifizierung, Route unterhalb ist nur für eingeloggte Nutzer nutzbar
router.use(passport.authenticate('jwt', { session: false }));
// Route um eingeloggten Nutzer zu erhalten (username, email und _id)
router.get('/current', getCurrent);

// Funktion zur Registrierung
async function registerUser(req, res, next) {
  // Nutzer in Datenbank hinzufügen
  let user = await usersCtrl.insert(req.body);
  user = user.toObject();
  delete user.password;
  delete user.appointments;
  delete user.invites;
  req.user = user;
  next()
}

function loginUser(req, res) {
  let user = req.user;
  let token = usersCtrl.generateToken(user);
  res.json({ user, token });
}

async function logoutUser(req, res) {
  req.logout();
}

async function getUsername(req, res) {
  let user = await usersCtrl.getUser(req.body);
  res.json({ username: user.username });
}

function getCurrent(req, res) {
  res.json(req.user);
}