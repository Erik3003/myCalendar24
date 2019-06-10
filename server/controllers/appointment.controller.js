const Joi = require('joi');
const Appointment = require('../models/appointment.model');
const userCtrl = require("./users.controller");
const categoryCtrl = require("./category.controller");

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
  all,
  public,
  extractPublic,
  extractDay
}

// Funktion zum Hinzufügen eines Termins in die DB
async function insert(appointment, user) {
  // Ersteller ist immer eingeloggter Nutzer
  appointment.creator = user._id.toString();

  // Verifizierung des Termin-Objekts
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });

  // Erhalten der dem Termin zugeordneten Kategorie
  var category = await categoryCtrl.getAppointmentCategory(appointment);

  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Abbruch wenn Kategorie nicht vorhanden
  if (category == null) {
    return { Status: 401 };
  }

  // Abbrcu wenn Kategorie nicht von Nutzer erstellt wurde
  var isUserCategoryCreator = await categoryCtrl.isCreator(category, user);
  if (!isUserCategoryCreator) {
    return { Status: 401 };
  }

  // Speichern des Termin auf DB
  appointment = await new Appointment(appointment).save();
  
  // Referenz auf neuen Termin dem Nutzer hinzufügen
  user.appointments.push(appointment._id);

  // Referenz speichern
  user.save();

  // Rückgabe des hinzugefügten Termin-Dokuments
  return appointment;
}

// Funktion zum Ändern von Terminen auf DB
async function update(appointment, user) {
  // Ersteller ist immer eingeloggter Nutzer
  appointment.creator = user._id.toString();

  // Verifizierung der Integrität des Termin-Objektes
  appointment = await Joi.validate(appointment, appointmentSchema, { abortEarly: false });

  // Erhalten des zu ändernden Termins aus Datenbank
  var oldAppointment = await getAppointment(appointment);

  // Erhalten der des Termin (neu) zugewiesenen Kategorie
  var category = await categoryCtrl.getAppointmentCategory(appointment);

  // Erhalten des Nutzer-Dokuments des eingeloggten Nutzers
  user = await userCtrl.getUser(user);

  // Abbruch wenn Termin nicht existiert
  if (appointment == null){
    return { Status:404 };
  }

  // Abbruch wenn Termin nicht von Nutzer erstellt wurde
  var isUserCreator = isCreator(oldAppointment, user);
  if (!isUserCreator){
    return { Status:401 };
  }

  // Abbruch wenn Kategorie nicht existiert
  if (category == null) {
    return { Status: 401 };
  }

  // Abbruch wenn Kategorie nicht von Nutzer erstellt wurde
  var isUserCategoryCreator = await categoryCtrl.isCreator(category, user);
  if (!isUserCategoryCreator) {
    return { Status: 401 };
  }

  // Ändern des Termins auf DB
  return await oldAppointment.replaceOne(appointment);
}

// Funktion zum Erhalten der Termine des Nutzers im gegebenen Monat
async function extract(date, user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Liste der Appointments des Nutzers
  var appointments = user.appointments;

  // Generierung des Anfangsdatums des Monats
  var startDate = new Date(date);
  startDate.setDate(0);
  startDate.setHours(23);
  startDate.setMinutes(59);
  startDate.setSeconds(59);
  startDate.setMilliseconds(999);

  // Generierung des Enddatums des Monats
  var endDate = new Date(startDate.toString());
  endDate.setMonth(startDate.getMonth() + 2);
  endDate.setDate(0);

  // Datenbankabfrage
  return await Appointment.find({ _id: { $in: appointments }, date: { $lt: endDate }, enddate: { $gt: startDate } });
}

async function extractDay(date, user) {
  user = await userCtrl.getUser(user);
  var appointments = user.appointments;

  var startDate = new Date(date);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  var endDate = new Date(startDate.toString());
  startDate.setHours(23);
  startDate.setMinutes(59);
  startDate.setSeconds(59);
  startDate.setMilliseconds(999);

  return await Appointment.find({ _id: { $in: appointments }, date: { $lte: endDate }, enddate: { $gte: startDate } });
}

async function extractPublic(startdate, enddate, user) {
  user = await userCtrl.getUser(user);

  var startDate = new Date(startdate);
  var endDate = new Date(enddate);

  return await Appointment.find({ public: true, date: { $lte: endDate }, enddate: { $gte: startDate }, _id: { $nin: user.appointments } });
}

async function add(appointment, user) {
  user = await userCtrl.getUser(user);
  appointment = await getAppointment(appointment);

  if (appointment == null || appointment.public != true) {
    return { Status: 401 };
  }
  var hasAppointmentAlready = hasAppointment(appointment, user);
  if (hasAppointmentAlready) {
    return { Status: 401 };
  }

  user.appointments.push(appointment._id);
  await userCtrl.saveUser(user);
  return { Success: true };
}

async function remove(appointment, user) {
  user = await userCtrl.getUser(user);
  appointment = await getAppointment(appointment);

  if (appointment == null){
    return { Status:404 };
  }

  var isUserCreator = isCreator(appointment, user);
  if (!isUserCreator) {
    var hasUserAppointment = hasAppointment(appointment, user);
    if (hasUserAppointment) {
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
  var users = await userCtrl.getUsers(appointment);
  users.forEach(async function(user) {
    let index = user.appointments.indexOf(appointment._id);
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
  return await Appointment.findById(appointment._id);
}

async function public(user) {
  user = await userCtrl.getUser(user);

  return await Appointment.find({ public: true, _id: { $nin: user.appointments } });
}

async function invite(user, appointment, target) {
  appointment = await getAppointment(appointment);
  user = await userCtrl.getUser(user);
  if(appointment == null || user == null) {
    return { Status: 401 };
  }


  var isUserCreator = await isCreator(appointment, user);
  if(isUserCreator) {
    target = await userCtrl.getUserByName(target);

    if (target == null) {
      return { Status: 400}
    }

    var isAlreadyInvited = isInvited(appointment, target);
    if(isAlreadyInvited) {
      return { Status: 400 }
    }

    var hasAppointmentAlready = hasAppointment(appointment, target);
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
  var isUserInvited = isInvited(invite, user);
  var successful = true;
  if(isUserInvited){

    if (invite.accept) {
      var appointment = await getAppointment(invite);
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
  var appointments = await Appointment.find({ _id: user.invites });
  return appointments;
}

async function all(user) {
  user = await userCtrl.getUser(user);
  var appointments = await Appointment.find({ _id: user.appointments });
  return appointments;
}