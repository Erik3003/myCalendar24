//Mongoose laden
const mongoose = require('mongoose');

//MongoDB URI
const mongoUri = "mongodb://localhost/mean";
//Verbindung mit Datenbank herstellen:
mongoose.connect(mongoUri, { keepAlive: 1 });


mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});


