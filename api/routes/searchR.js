'use strict'

var express = require('express');
var SearchController = require('../controllers/searchC');
var api = express.Router();
var md_auth = require('../middlewares/autenticated');

var multipart = require('connect-multiparty');


api.get('/search/:text',md_auth.ensureAuth, SearchController.search);

module.exports = api;