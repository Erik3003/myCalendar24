const Joi = require('joi');
const Appointment = require('../models/appointment.model');

const appointmentSchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.date().required(),
  enddate: Joi.date(),
  description: Joi.string()
})


module.exports = {
  insert,
  extract
}

async function insert(appointment) {
    appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });
  return await new Appointment(appointment).save();
}

async function extract(user) {
  console.log(user);
  return await Appointment.find({"creator": user});
}
