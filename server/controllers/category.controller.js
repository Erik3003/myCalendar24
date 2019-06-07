const Joi = require('joi');
const Category = require('../models/category.model');
const userCtrl = require("./users.controller")
const appointmentCtrl = require("./appointment.controller")


const categorySchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  color: Joi.string().required(),
})

module.exports = {
  insert,
  remove,
  get,
  update,
  isCreator
}

async function insert(category, user) {
  category.creator = user._id;
  category = await Joi.validate(category, categorySchema, { abortEarly: false });
  return await new Category(category).save();
}

async function remove(category, user) {
  if (!appointmentCtrl.hasAnyAppointmentCategory(category)) {
    if (userCtrl.getUser(user)._id == getCategory(category).creator){
      return await Category.deleteOne({_id: category._id});
    }
    return { Status:401 };
  }
  return { Status:403 }
}

async function update(category, user) {
  category.creator = user._id;
  category = await Joi.validate(category, categorySchema, { abortEarly: false });
  oldCategory = await getCategory(category);

  if (category == null){
    return { Status:404 };
  }
  if (!isCreator(category, user)){
    return { Status:401 };
  }

  return await oldCategory.replaceOne(category);
}

async function get(user) {
  return await Category.find({creator:user._id});
}

async function getCategory(category) {
  return await Category.findById(category._id);
}

function isCreator(category, user) {
  return user._id.toString() == getCategory(category).creator.toString();
}