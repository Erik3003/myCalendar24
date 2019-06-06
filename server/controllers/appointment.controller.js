const Joi = require('joi');
const Appointment = require('../models/appointment.model');
const userCtrl = require("./users.controller")

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
  add,
  getAppointment,
  public,
  invite,
  invites,
  accept,
  hasAnyAppointmentCategory
}

async function insert(appointment, user) {
  appointment.creator = user._id.toString();
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });
  appointment = await new Appointment(appointment).save();
  console.log(user);
  user = await userCtrl.getUser(user);
  user.appointments.push(appointment._id);
  user.save();
  return appointment;
}

async function update(appointment, user) {
  appointment.creator = user._id;
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });
  oldAppointment = await getAppointment(appointment);

  if (appointment == null){
    return { Status:404 };
  }
  if (!isCreator(appointment, user)){
    return { Status:401 };
  }

  return await oldAppointment.replaceOne(appointment);
}

async function extract(date, user) {
  user = await userCtrl.getUser(user);
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
  user = await userCtrl.getUser(user);
  appointments = user.appointments;
  user.appointments.push(appointment._id);
  return await user.save();
}

async function remove(appointment, user) {
  user = await userCtrl.getUser(user);
  appointment = await getAppointment(appointment);

  if (appointment == null){
    return { Status:404 };
  }
  if (!isCreator(appointment, user)){
    return { Status:401 };
  }
  
  console.log(appointment._id);
  user.appointments.splice(user.appointments.indexOf(appointment._id), 1);
  return await Appointment.deleteOne({_id: appointment._id});
}

function isCreator(appointment, user) {
  return user._id == getAppointment(appointment).creator.toString();
}

function isInvited(appointment, user) {
  return user.invites.includes(appointment._id);
}

async function getAppointment(appointment) {
  return await Appointment.findById(appointment._id);
}

async function hasAnyAppointmentCategory(category) {
  console.log(await Appointment.findOne({category:category._id}));
  if (await Appointment.findOne({category:category._id})._id != null) {
    return true;
  }
  return false;
}

async function public() {
  return await Appointment.find({public:true});
}

async function invite(user, appointment, target) {
  if(await isCreator(appointment, user)){
    inviteTarget = await getUser(target);
    return await target.invite.push(appointment._id);
  }
  return { Status:401 };
}

async function accept(user, invite) {
  user = await userCtrl.getUser(user);
  if(await isInvited(invite, user)){
    if (invite.accept) {
      user.appointments.push(invite._id);
    }
    user.invites.splice(user.invites.indexOf(invite._id), 1);
    return { Success: true, Accepted: invite.accept };
  }
  return { Status:401 };
}

async function invites(user) {
  user = await userCtrl.getUser(user);
  return await user.invites;
}