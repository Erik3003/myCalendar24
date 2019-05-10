const path = require('path')
const express = require('express');

const app = express();
const port = 3000;

var distDir = '../dist/MeanProject/';
var distPath = path.join(__dirname, distDir);

console.log(distPath.toString());

app.use(express.static(distPath));

//app.get('/', (req, res) => res.send('<h1>Hello World!</ h1>'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));