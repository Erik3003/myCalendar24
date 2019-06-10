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

  // Datenbankabfrage und Rückgabe
  return await Appointment.find({ _id: { $in: appointments }, date: { $lt: endDate }, enddate: { $gt: startDate } });
}

// Funktion zum Erhalten der Termine des Nutzers am gegebenen Tag
async function extractDay(date, user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Liste der Appointments des Nutzers
  var appointments = user.appointments;

  // Generierung des Anfangsdatums des Tages
  var startDate = new Date(date);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  // Generierung des Enddatums des Tages
  var endDate = new Date(startDate.toString());
  startDate.setHours(23);
  startDate.setMinutes(59);
  startDate.setSeconds(59);
  startDate.setMilliseconds(999);

  console.log("Start: " + startDate.toString() + "\nEnde: " + endDate.toString());

  // Datenbankabfrage und Rückgabe
  return await Appointment.find({ _id: { $in: appointments }, date: { $lte: endDate }, enddate: { $gte: startDate } });
}

// Funktion zum Erhalten der öffentlichen Termine zwischen den zwei Daten 
async function extractPublic(startdate, enddate, user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Generierung der Daten
  var startDate = new Date(startdate);
  var endDate = new Date(enddate);

  // Datenbankabfrage und Rückgabe
  return await Appointment.find({ public: true, date: { $lte: endDate }, enddate: { $gte: startDate }, _id: { $nin: user.appointments } });
}

// Funktion zum Hinzufügens eines bestehenden Termins zum Nutzer
async function add(appointment, user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Erhalten des Termin-Dokuments
  appointment = await getAppointment(appointment);

  // Abbruch wenn Termin nicht gefunden oder nicht öffentlich
  if (appointment == null || appointment.public != true) {
    return { Status: 401 };
  }

  // Abbruch wenn Nutzer Termin schon besitzt
  var hasAppointmentAlready = hasAppointment(appointment, user);
  if (hasAppointmentAlready) {
    return { Status: 401 };
  }

  // Hinzufügen des Termins beim Nutzer in DB
  user.appointments.push(appointment._id);

  // Speichern des Nutzers
  await userCtrl.saveUser(user);

  // Rückgabe
  return { Success: true };
}

// Funktion zum Entfernen von Terminen von Nutzern und Löschen aus DB
async function remove(appointment, user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);
  
  // Erhalten des Termin-Dokuments
  appointment = await getAppointment(appointment);

  // Abbruch wenn Termin nicht existiert
  if (appointment == null){
    return { Status:404 };
  }

  // Wenn Nutzer nicht Ersteller des Termins ist, wird der Termin nur bei ihn entfernt
  var isUserCreator = isCreator(appointment, user);
  if (!isUserCreator) {

    // Abbruch wenn der Nutzer den Termin nicht besitzt
    var hasUserAppointment = hasAppointment(appointment, user);
    if (hasUserAppointment) {
      // Entfernen des Termins vom Nutzer
      user.appointments.splice(user.appointments.indexOf(appointment._id), 1);

      // Speichern des Nutzers in DB
      await userCtrl.saveUser(user);

      // Rückgabe von Erfolg
      return { Success: true }
    }
    return { Status:401 };
  }
  
  // Löschen des Termins von allen Nutzern
  await removeFromUsers(appointment);

  // Löschen des Termins aus DB
  return await Appointment.deleteOne({_id: appointment._id});
}

// Funktion zum Löschen der Termin-Referenz von allen Nutzern
async function removeFromUsers(appointment) {
  // Erhalten aller Nutzer mit dem Termin
  var users = await userCtrl.getUsers(appointment);

  // Iterieren über die Nutzer
  users.forEach(async function(user) {
    // Erhalten des Indexes des Termins
    let index = user.appointments.indexOf(appointment._id);

    // Entfernen des Termins
    user.appointments.splice(index, 1);

    // Speichern des Nutzers auf DB
    await userCtrl.saveUser(user);
  });
}

// Funktion die zurückgibt, ob der Nutzer Ersteller des Termins ist
function isCreator(appointment, user) {
  return user._id.toString() == appointment.creator.toString();
}

// Funktion die zurückgibt, ob der Nutzer zu dem Termin eingeladen ist
function isInvited(appointment, user) {
  return user.invites.includes(appointment._id);
}

// Funktion die zurückgibt, ob der Nutzer den Termin besitzt
function hasAppointment(appointment, user) {
  return user.appointments.includes(appointment._id);
}

// Funktion die das Termin-Dokument des Termins zurückgibt
async function getAppointment(appointment) {
  return await Appointment.findById(appointment._id);
}

// Funktion die alle öffentlichen Termine, welche der Nutzer noch nicht besitzt, zurückgibt
async function public(user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Datenbankabfrage und Rückgabe der Termine
  return await Appointment.find({ public: true, _id: { $nin: user.appointments } });
}

// Funktion die den Zielnutzer zu einem Termin der der Nutzer erstellt hat einläd
async function invite(user, appointment, target) {
  // Erhalten des Termin-Dokuments
  appointment = await getAppointment(appointment);

  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Abbruch wenn Nutzer oder Termin nicht vorhanden
  if(appointment == null || user == null) {
    return { Status: 401 };
  }

  // Abbruch wenn Nutzer nicht Ersteller des Termins
  var isUserCreator = await isCreator(appointment, user);
  if(!isUserCreator) {
    return { Status:401 };
  }

  // Erhalten des Zielnutzer-Dokuments
  target = await userCtrl.getUserByName(target);

  // Abbruch wenn Zielnutzer nicht vorhanden
  if (target == null) {
    return { Status: 400}
  }

  // Abbruch wenn Zielnutzer schon eingeladen
  var isAlreadyInvited = isInvited(appointment, target);
  if(isAlreadyInvited) {
    return { Status: 400 }
  }

  // Abbruch wenn Zielnutzer schon den Termin besitzt
  var hasAppointmentAlready = hasAppointment(appointment, target);
  if(hasAppointmentAlready) {
    return { Status: 400 }
  }

  // Termin wird den Einladungen des Zielnutzers hinzugefügt
  target.invites.push(appointment._id);

  // Zielnutzer wird gespeichert
  return await target.save();
}

// Funktion zum Akzeptieren oder Ablehnen einer Einladung
async function accept(user, invite) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);
  var successful = true;

  // Wenn Nutzer zu Termin eingeladen
  var isUserInvited = isInvited(invite, user);
  if(isUserInvited){
    //Wenn Nutzer Einladung akzeptiert
    if (invite.accept) {
      // Erhalten des Termin-Dokuments
      var appointment = await getAppointment(invite);
      successful = false;

      // Wenn Termin existiert
      if (appointment != null) {
        // Termin wird Nutzer hinzugefügt
        user.appointments.push(invite._id);
        successful = true;
      }
    }

    // Einladung wird von Nutzer entfernt
    user.invites.splice(user.invites.indexOf(invite._id), 1);

    // Nutzer wird gespeichert
    await user.save();

    // Rückgabe ob erfolgreich
    return { Success: successful, Accepted: invite.accept };
  }
  return { Status:401 };
}

// Funktion die alle Einladungen die ein Nutzer hat zurückgibt
async function invites(user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Erhalten der Termin-Dokumente zu welchen der Nutzer eingeladen ist
  var appointments = await Appointment.find({ _id: user.invites });

  // Rückgabe der Termine
  return appointments;
}

// Funktion die alle Termine die der Nutzer besitzt zurückgibt
async function all(user) {
  // Erhalten des Nutzer-Dokuments
  user = await userCtrl.getUser(user);

  // Finden aller Termine des Nutzers
  var appointments = await Appointment.find({ _id: user.appointments });

  // Rückgabe der Termine
  return appointments;
}