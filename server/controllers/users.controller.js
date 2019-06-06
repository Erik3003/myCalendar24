const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

module.exports = {
  insert,
  generateToken
}

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.password = bcrypt.hashSync(user.password, 10);
  //delete user.password;
  return await new User(user).save();
}

function generateToken(user) {
  const payload = JSON.stringify(user);
  return jwt.sign(payload, "JaDiesIstEinSuperGeheimerSchlüssel");
}