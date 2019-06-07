const Joi = require('joi');
const Appointment = require('../models/appointment.model');
const userCtrl = require("./users.controller")

const appointmentSchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.date().required(),
  enddate: Joi.date().required(),
  category: Joi.string().required(),
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


  if (!isCreator(appointment, user)) {
    if (hasAppointment(appointment, user)) {
      user.appointments.splice(user.appointments.indexOf(appointment._id), 1);
      await userCtrl.saveUser(user);
      return { Success: true }
    }
    return { Status:401 };
  }
  
  await removeFromUsers(appointment);
  return await Appointment.deleteOne({_id: appointment._id});
}

async function removeFromUsers(appointment) {
  users = await userCtrl.getUsers(appointment);
  users.forEach(async function(user) {
    index = user.appointments.indexOf(appointment._id);
    user.appointments.splice(index, 1);
    await userCtrl.saveUser(user);
  });
}

function isCreator(appointment, user) {
  return user._id.toString() == appointment.creator.toString();
}

function isInvited(appointment, user) {
  return user.invites.includes(appointment._id);
}

function hasAppointment(appointment, user) {
  return user.appointments.includes(appointment._id);
}

async function getAppointment(appointment) {
  console.log("APPOINTMEMT ID:   " + appointment._id)
  return await Appointment.findById(appointment._id);
}

async function hasAnyAppointmentCategory(category) {
  appointment = await Appointment.findOne({category:category._id});
  if (appointment != null) {
    return true;
  }
  return false;
}

async function public() {
  return await Appointment.find({public:true});
}

async function invite(user, appointment, target) {
  appointment = await getAppointment(appointment);
  user = await userCtrl.getUser(user);
  if(appointment == null || user == null) {
    return { Status: 401 };
  }


  isUserCreator = await isCreator(appointment, user);
  if(isUserCreator) {
    target = await userCtrl.getUser(target);

    if (target == null) {
      return { Status: 400}
    }

    isAlreadyInvited = isInvited(appointment, target);
    if(isAlreadyInvited) {
      return { Status: 400 }
    }

    hasAppointmentAlready = hasAppointment(appointment, target);
    if(hasAppointmentAlready) {
      return { Status: 400 }
    }

    target.invites.push(appointment._id);
    return await target.save();
    //return { Success: true };
  }
  return { Status:401 };
}

async function accept(user, invite) {
  user = await userCtrl.getUser(user);
  isUserInvited = isInvited(invite, user);
  successful = true;
  if(isUserInvited){

    if (invite.accept) {
      appointment = await getAppointment(invite);
      successful = false;
      if (appointment != null) {
        user.appointments.push(invite._id);
        successful = true;
      }
    }
    user.invites.splice(user.invites.indexOf(invite._id), 1);
    await user.save();
    return { Success: successful, Accepted: invite.accept };
  }
  return { Status:401 };
}

async function invites(user) {
  user = await userCtrl.getUser(user);
  return user.invites;
}