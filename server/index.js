const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
require('./init/mongoose');
const routes = require('./routes/index.route');
const passport = require('passport');
const session = require('express-session');

const app = express();
const port = 3000;

// Passport Config
require('./init/passport')(passport);

var distDir = '../dist/MeanProject/';
var distPath = path.join(__dirname, distDir);

console.log(distPath.toString());

app.use(express.static(distPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        name: 'myCalendar.sid',
        //secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 36000000,
            httpOnly: false,
            secure: false
        }
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());  

app.use('/api/', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));