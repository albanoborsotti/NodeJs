'use strict'

var express = require('express');
var SongController = require('../controllers/songC');
var api = express.Router();
var md_auth = require('../middlewares/autenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song/:id',md_auth.ensureAuth, SongController.getSong);
api.post('/song',md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?',md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id',md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id',[md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);


//api.get('/artists/:page?',md_auth.ensureAuth, ArtistController.getArtists);
//api.put('/artist/:id',md_auth.ensureAuth, ArtistController.updateArtist);
//api.delete('/artist/:id',md_auth.ensureAuth, ArtistController.deleteArtist );
//api.post('/upload-image-artists/:id',[md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
//api.get('/get-image-artists/:imageFile',ArtistController.getImageFile);

module.exports = api;
