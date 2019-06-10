const mongoose = require('mongoose');

// Appointment (Termin) Mongoose Datenbankschema
const AppointmentSchema = new mongoose.Schema({
    // Creator ist eine Referenz auf das User-Dokument des Termin-Erstellers
    creator: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    // Titel des Termins
    title: {
      type: String,
      required: true
    },
    // Anfangsdatum des Termins
    date: {
        type: Date,
        required: true
    },
    // Enddatum des Termins
    enddate: {
      type: Date,
      required: true
    },
    // Optionale Beschreibung des Termins
    description: {
        type: String,
        required: false
    },
    // Optimaler Öffentlichkeitswert des Termin
    public: {
        type: Boolean,
        required: false
    },
    // Category ist eine Referenz auf die dem Termin zugeortnete Kategorie
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true
    }
  }, {
    versionKey: false
  });
  
  module.exports = mongoose.model('Appointment', AppointmentSchema);