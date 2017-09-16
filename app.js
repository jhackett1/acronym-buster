const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Define a port and the location of the Mongo DB
const port = process.env.port || 3000;
const mongoUrl = 'mongodb://localhost:27017/acronym-buster';

// Get the express app
const app = express();

// Set up body parser and validator
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());

// Main routes
const mainRouter = require('./routes/mainRoutes')();
app.use('/', mainRouter);

// API routes
const apiRouter = require('./routes/apiRoutes')(mongoUrl);
app.use('/api', apiRouter);

// Define the public assets dir
app.use(express.static('./public'));

// Define view engine and location
app.set('view engine', 'ejs');
app.set('views', './views');

// Bind a port to the server
app.listen(port, function () {
  console.log('Acronym Buster is running on port ' + port);
});
