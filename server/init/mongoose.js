// Mongoose laden
const mongoose = require('mongoose');

// MongoDB URI
const mongoUri = "mongodb://localhost/mean";

// Verbindung mit Datenbank herstellen
mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true, keepAlive: 1 });

// Fehler bei nicht erfolgreicher Verbindung werfen
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${mongoUri}`);
});