const mongoose = require('mongoose');

// Category (Kategorie) Mongoose Datenbankschema
const CategorySchema = new mongoose.Schema({
  // Titel der Kategorie
  title: {
    type: String,
    required: true
  },
  // Farbe der Kategorie
  color: {
    type: String,
    required: true
  },
  // Verweiß auf Ersteller der Kategorie
  creator: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  // Variable um einfaches Löschen der Kategorie zu verhindern
  persistance: {
    type: Boolean
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Category', CategorySchema);