const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// JOI Schema zum Verifizieren der eingehenden User
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

module.exports = {
  insert,
  generateToken,
  getUser,
  getUsers,
  saveUser,
  getUserByName
}

// Funktion die Nutzer in Datenbank schreibt
async function insert(user) {
  // Verifizierung der Integrität des erhaltenen Nutzer-Objekts
  user = await Joi.validate(user, userSchema, { abortEarly: false });

  // Umwandeln des Passworts in einen Hash
  user.password = bcrypt.hashSync(user.password, 10);

  // Speichern des neuen Nutzers und zurückliefern des erstellten Nutzer-Dokuments
  // Ist der Username oder die Email schon vergeben, so schlägt dies fehl (Code 500),
  // da Email und Username unique sind.
  return await new User(user).save();
}

// Funktion zur Generierung eines Nutzer-Tokens
function generateToken(user) {
  // Nutzerdaten in JSON String umwandeln
  const payload = JSON.stringify(user);

  // JsonWebToken aus Nutzerdaten und geheimen Schlüssel generieren
  return jwt.sign(payload, "JaDiesIstEinSuperGeheimerSchlüssel");
}

// Funktion zum Erhalten eines Nutzer-Dokuments
async function getUser(user) {
  //Finden des Dokuments auf der Datenbank mithilfe der _id
  return await User.findById(user._id);
}

// Funktion zum Erhalten der Nutzer, welche über diesen Termin verfügen
async function getUsers(appointment) {
  // Finden der Dokumente auf der Datenbank mithilfe der _id des Termins
  return await User.find({ appointments: appointment._id });
}

// Speichern eines Nutzer-Objekts auf der Datenbank
async function saveUser(user) {
  await User(user).save();
}

// Funktion zum erhalten eines Nutzers mithilfe des Nutzernamens
async function getUserByName(user) {
  // Nutzer-Dokument mithilfe des Nutzernamens finden und zurückgeben
  return await User.findOne({ username: user.username });
}