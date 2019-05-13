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
  console.log(user);
  const newUser;
  if(user.password == user.password2) {
    User.findOne({ username: user.username }).then(oldUser => {
      if (oldUser) {
        console.log('username is taken');
      } else {
        User.findOne({ email: user.email }).then(oldUser => {
          if(oldUser) {
            console.log("E-Mail is taken");
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                console.log("ICH WAR HIER");
                newUser = new User({
                  username: user.username,
                  email: user.email,
                  password: hash
                });       
                console.log(newUser);

                return await newUser.save();
              });
            });          
            //return await new User(user).save();
          }
        });        
      }
    });
  }  
}

async function login(req ,res) {
  console.log(req.body);
  passport.authenticate('local'), function(req, res) {
    console.log(req.user.username);
    res.redirect('/' + req.user.username);
  }

  /*passport.authenticate('local', function(err, user, info) {
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
  })(req, res, next);*/
}

async function logout(req, res) {
  console.log(req.body);
  req.logout();
}