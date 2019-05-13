const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model');
const passport = require('passport');

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password2: Joi.string().required()
})

module.exports = {
  insert,
  login,
  logout
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  if(user.password == user.password2) {
      User.findOne({ username: user.username }).then(oldUser => {
        if (oldUser) {
          console.log('Benutzer existiert bereits');
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;            
            });
          });
        }
      });
    }
    
  return await new User(user).save();
}

async function login(user) {
  console.log(user);
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      console.log(err); 
    } else if (!user) { 
      console.log(info) 
    } else {
      req.logIn(user, function(err) {
        if (err) { 
          console.log(err); 
        } else {
          //return res.redirect('/' + user.username);
          console.log(user);
        }
      });
  }
  })(req, res, next);
  //return await user.find({"username": user});
}

async function logout(user) {
  console.log(user);
  req.logout();
}