const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/users.model');

module.exports = function(passport) {
  passport.use('local',
    new LocalStrategy( (username, password, done) => {
      // Match user
      User.findOne({username: username}).then(user => {
        if (!user) {
          console.log("User was not found");
          return done(null, false, { message: 'Incorrect username' });
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {console.log(err);};
            if (isMatch) {
              console.log("password matches");
              console.log(user);
              return done(null, user);
            } else {
              console.log("password doesn't match");
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        }        
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};