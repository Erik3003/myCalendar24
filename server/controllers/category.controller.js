const Joi = require('joi');
const Category = require('../models/category.model');
const userCtrl = require("./users.controller")
const appointmentCtrl = require("./appointment.controller")


const categorySchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  color: Joi.string().required(),
  _id: Joi.string()
})

module.exports = {
  insert,
  remove,
  get,
  update,
  isCreator
}

async function insert(category, user) {
  category.creator = user._id.toString();
  category = await Joi.validate(category, categorySchema, { abortEarly: false });
  return await new Category(category).save();
}

async function remove(category, user) {
  hasAny = await appointmentCtrl.hasAnyAppointmentCategory(category);
  if (!hasAny) {
    category = await getCategory(category);
    user = await userCtrl.getUser(user);
    if (category != null && user != null && user._id.toString() == category.creator.toString()){
      return await Category.deleteOne({_id: category._id});
    }
    return { Status:401 };
  }
  return { Status:403 }
}

async function update(category, user) {
  category.creator = user._id.toString();
  category = await Joi.validate(category, categorySchema, { abortEarly: false });
  oldCategory = await getCategory(category);

  if (category == null){
    return { Status:404 };
  }
  if (!await isCreator(category, user)){
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

async function isCreator(category, user) {
  category = await getCategory(category);
  return user._id.toString() == category.creator.toString();
}