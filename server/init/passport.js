const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// Load User model
const User = require('../models/users.model');

const localLogin = new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  // Match user
  User.findOne({
    username: username
  }).then(user => {
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    } else {
      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    }        
  });
})

const jwtLogin = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "JaDiesIstEinSuperGeheimerSchlüssel"
}, async (payload, done) => {
  let user = await User.findById(payload._id);
  
  if (!user) {
    return done(null, false);
  }
  user = user.toObject();
  delete user.password;
  delete user.appointments;
  delete user.invites;
  done(null, user);
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
