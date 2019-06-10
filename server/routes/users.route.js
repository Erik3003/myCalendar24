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

  // Nutzer-Dokument in Objekt umwandeln
  user = user.toObject();

  // Löschen einiger Attribute
  delete user.password;
  delete user.appointments;
  delete user.invites;

  // req.user auf den Nutzer setzen
  req.user = user;

  // Next Route ausführen
  next()
}

// Funktion zur Generierung eines Tokens
function loginUser(req, res) {
  // Token aus Nutzer-Objekt generieren
  let token = usersCtrl.generateToken(req.user);

  //Nutzer-Objekt und Token als JSON verschicken
  res.json({ user, token });
}

// Funktion zum Ausloggen
async function logoutUser(req, res) {
  // Löscht res.user
  req.logout();
}

// Funktion zum erhalten des Nutzernamens eines Nutzers
async function getUsername(req, res) {
  // Nutzer-Dokument des Nutzers erhalten
  let user = await usersCtrl.getUser(req.body);

  // Nutzernamen in JSON verschicken
  res.json({ username: user.username });
}

// Funktion zum erhalten der Daten des eingeloggten Nutzers
function getCurrent(req, res) {
  // Schicken des Nutzer-Objekts in JSON
  res.json(req.user);
}