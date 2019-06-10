const Joi = require('joi');
const Category = require('../models/category.model');
const userCtrl = require("./users.controller")
const appointmentCtrl = require("./appointment.controller")

// JOI Schema zum Verifizieren der eingehenden Categories
const categorySchema = Joi.object({
  creator: Joi.string().required(),
  title: Joi.string().required(),
  color: Joi.string().required(),
  _id: Joi.string(),
  persistance: Joi.boolean()
})

module.exports = {
  insert,
  remove,
  get,
  update,
  isCreator,
  getCategory,
  getAppointmentCategory
}

// Funktion zum Einfügen einer neuen Kategrie in die Datenbank
async function insert(category, user) {
  // Ersteller wird überschrieben, Ersteller ist immer der eingeloggte Nutzer
  category.creator = user._id.toString();

  // Validierung der Integrität des Category-Objekts
  category = await Joi.validate(category, categorySchema, { abortEarly: false });

  // Schreiben der Kategorie in Datenbank und zurückgabe des erstellten Dokuments
  return await new Category(category).save();
}

// Funktion zum Löschen von Kategorien aus Datenbank
async function remove(category, user) {
  // Überprüfen ob Kategorie immer noch benutzt wird, also Appointments zugewiesen ist
  hasAny = await appointmentCtrl.hasAnyAppointmentCategory(category);
  if (!hasAny) {
    // Erhalten des Category-Dokuments aus DB
    category = await getCategory(category);

    // Erhalten des eingeloggten Nutzers aus DB
    user = await userCtrl.getUser(user);

    //Wenn Kategorie u. Nutzer existieren und der Nutzer die Kategorie erstellt hat und sie löschbar ist
    if (category != null && user != null && user._id.toString() == category.creator.toString() && (category.persistance == null || category.persistance == false)){
      //Löschen der Kategorie aus Datenbank und Rückgabe des Erfolgs der Operation
      return await Category.deleteOne({_id: category._id});
    }
    // Rückgabe eines Fehlercodes (Unerlaubt)
    return { Status:401 };
  }
  return { Status:403 };
}

// Funktion zum Ändern von Kategorien in Datenbank
async function update(category, user) {
  // Ersteller wird überschrieben, Ersteller ist immer der eingeloggte Nutzer
  category.creator = user._id.toString();

  // Validierung der Eingabe
  category = await Joi.validate(category, categorySchema, { abortEarly: false });

  // Erhalten des zu ändernden Kategorie-Dokuments
  oldCategory = await getCategory(category);

  // Abbruch wenn Kategorie nicht existiert
  if (oldCategory == null){
    return { Status:401 };
  }

  // Abbruch wenn Nutzer nicht Ersteller der Kategorie
  isUserCreator = await isCreator(oldCategory, user);
  if (!isUserCreator){
    return { Status:401 };
  }

  // Ändern des Kategorie-Dokuments in DB und Rückgabe
  return await oldCategory.replaceOne(category);
}

// Funktion zum Erhalten aller Kategorien die der Nutzer erstellt hat
async function get(user) {
  return await Category.find({creator:user._id});
}

// Funktion zum erhalten eines Categorie-Dokuments aus DB
async function getCategory(category) {
  return await Category.findById(category._id);
}

// Funktion zum erhalten eines Categorie-Dokuments aus DB das dem gegebenen Termin zugeortnet ist
async function getAppointmentCategory(appointment) {
  return await Category.findById(appointment.category);
}

// Funktion zur überprüfung ob der Nutzer Ersteller der Kategorie ist
async function isCreator(category, user) {
  return user._id.toString() == category.creator.toString();
}