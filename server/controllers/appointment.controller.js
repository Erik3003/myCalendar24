const Joi = require('joi');
const Appointment = require('../models/appointment.model');
const User = require('../models/users.model');

const appointmentSchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.date().required(),
  enddate: Joi.date().required(),
  description: Joi.string(),
  _id: Joi.string(),
  public: Joi.bool()
})


module.exports = {
  insert,
  extract,
  update,
  remove,
  add
}

async function insert(appointment, user) {
  appointment.creator = user._id.toString();
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });
  appointment = await new Appointment(appointment).save();
  console.log(user);
  user = await getUser(user);
  user.appointments.push(appointment._id);
  user.save();
  return appointment;
}

async function update(appointment, user) {
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });
  oldAppointment = await getAppointment(appointment);

  if (appointment == null){
    return { Status:404 };
  }
  if (!isCreator(appointment, user)){
    return { Status:401 };
  }

  appointment.creator = user._id;
  return await oldAppointment.replaceOne(appointment);
}

async function extract(date, user) {
  user = await getUser(user);
  appointments = user.appointments;
  console.log(date);

  startDate = new Date(date);
  startDate.setDate(0);
  startDate.setHours(23);
  startDate.setMinutes(59);
  startDate.setSeconds(59);
  startDate.setMilliseconds(999);
  endDate = new Date(startDate.toString());
  endDate.setMonth(startDate.getMonth() + 2);
  endDate.setDate(0);

  console.log(startDate + "  " + endDate);

  return await Appointment.find({ _id: { $in: appointments }, date: { $lt: endDate }, enddate: { $gt: startDate } });
}

async function add(appointment, user) {
  user = await getUser(user);
  appointments = user.appointments;
  user.appointments.push(appointment._id);
  return await user.save();
}

async function remove(appointment, user) {
  user = await getUser(user);
  appointment = await getAppointment(appointment);

  if (appointment == null){
    return { Status:404 };
  }
  if (!isCreator(appointment, user)){
    return { Status:401 };
  }
  
  console.log(appointment._id);
  return await Appointment.deleteOne({_id: appointment._id});
}

function isCreator(appointment, user) {
  return user._id == appointment.creator.toString();
}

async function getUser(user) {
  return await User.findById(user._id);
}

async function getAppointment(appointment){
  return await Appointment.findById(appointment._id);
}

