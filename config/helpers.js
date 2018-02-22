const supertest = require('supertest')
const chai = require('chai')
const app = require('../index.js')

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;
global.timeout = 15000;

module.exports = global
