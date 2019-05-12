const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
require('./init/mongoose');
const routes = require('./routes/index.route');

const app = express();
const port = 3000;

var distDir = '../dist/MeanProject/';
var distPath = path.join(__dirname, distDir);

console.log(distPath.toString());

app.use(express.static(distPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));