const mongoose = require('mongoose');

// User (Nutzer) Mongoose Datenbankschema
const UserSchema = new mongoose.Schema({
  // Nutzername des Nutzers, einzigartig also nur ein mal in der Datenbank enthalten
  username: {
    type: String,
    unique: true,
    required: true
  },
  // Email-Addresse des Nutzers, einzigartig
  email: {
    type: String,
    unique: true,
    required: true
  },
  // Passwort des Users, nicht im Klartext sondern als Hash gespeichert
  password: {
    type: String,
    required: true
  },
  // Liste der Termine (Referenzen auf Appointment-Dokumente) die der Nutzers erstellt oder hinzugefügt hat
  appointments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment',
  }],
  // Liste der Einladungen (Referenzen auf Appointment-Dokumente) die der Nutzers erhalten hat
  invites: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment',
  }]
}, {
  versionKey: false
});

module.exports = mongoose.model('User', UserSchema);