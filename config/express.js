const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../api/resources');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/', routes);

module.exports = app;
