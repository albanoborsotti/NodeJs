'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function search(req, res){
    var text = req.params.text;

    Album.find({title:text}).exec((err, album) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(500).send({message: 'No se encontraron Artistas'});
            }else{
                
                Artist.find({name:text}).exec((err, artist) =>{
                    if(err){
                        res.status(500).send({message: 'Error en la peticion'});
                    }else{
                        if(!artist){
                            res.status(500).send({message: 'No se encontraron Artistas'});
                        }else{
                           //res.status(200).send({album:album,artist:artist});

                           Song.find({name:text}).exec((err, song) =>{
                            if(err){
                                res.status(500).send({message: 'Error en la peticion'});
                            }else{
                                if(!song){
                                    res.status(500).send({message: 'No se encontraron Artistas'});
                                }else{
                                   res.status(200).send({album:album,artist:artist,song:song});
                                }
                            }
                            });

                        }
                    }
                });   
              
            }
        }
    });

    //res.status(200).send({artist: artista,album:albumVar});

    //var findAlbum = Album.find({title: text}).sort('title');
    //var findSong = Album.find({name: text}).sort('name');



}
module.exports = {
   search
}