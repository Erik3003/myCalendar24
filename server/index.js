const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
require('./init/mongoose');
const routes = require('./routes/index.route');
const passport = require('./init/passport');
const session = require('express-session');

// Express Anwendung erstellen
const app = express();
const port = 3000;

// Pfad zu gebuildeten Client-Dateien bilden
var distDir = '../dist/MeanProject/';
var distPath = path.join(__dirname, distDir);

console.log(distPath.toString());

// Standartpfad auf Client setzen
app.use(express.static(distPath));

// Bodyparser Setup um req automatisch von JSON-Strings in Objecte umzuwandeln
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express-Session erstellen
app.use(
    session({
        name: 'myCalendar.sid',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 36000000,
            httpOnly: false,
            secure: false
        }
    })
  );
  
// Passport initializieren
app.use(passport.initialize());

// API-Route erstellen
app.use('/api/', routes);

// Server starten
app.listen(port, () => console.log(`Example app listening on port ${port}!`));