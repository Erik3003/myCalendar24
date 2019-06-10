const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// User-Model laden
const User = require('../models/user.model');

// Nicht Token-basiertes Loginverfahren
const localLogin = new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {

  // Nutzer finden
  User.findOne({
    username: username
  }).then(user => {

    // Abbrechen wenn Nutzer nicht vorhanden
    if (!user) {
      return done(null, false, { message: 'Falscher Nutzername' });
    } else {

      // Passwort mit Bcrypt überprüfen
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        // Passwort korrekt
        if (isMatch) {

          // User-Dokument in Object umwandeln
          user = user.toObject();

          // Löschen von Attributen die der Client nicht erhalten soll
          delete user.password;
          delete user.appointments;
          delete user.invites;

          // Einloggen abschließen (setzt automatisch req.user)
          return done(null, user);
        } else {
          return done(null, false, { message: 'Falsches Passwort' });
        }
      });
    }        
  });
})

// Token basiertes Loginverfahren
const jwtLogin = new JwtStrategy({
  // Entschlüsselung mit Bearer-Token Verfahren, setzen des zur Verschlüsselung benutzten Schlüssels
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "JaDiesIstEinSuperGeheimerSchlüssel"
}, async (payload, done) => {
  // User finden
  let user = await User.findById(payload._id);
  
  // Abbruch wenn User nicht vorhanden
  if (!user) {
    return done(null, false);
  }

  // User-Dokument in Object umwandeln
  user = user.toObject();

  // Löschen von Attributen die der Client nicht erhalten soll
  delete user.password;
  delete user.appointments;
  delete user.invites;

  // Einloggen abschließen (setzt automatisch req.user)
  done(null, user);
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
