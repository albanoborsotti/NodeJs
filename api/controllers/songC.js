'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
    //res.status(200).send({message: 'Metodo Get'});
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!song){
                res.status(404).send({message: 'No Existe la cancion'});
            }else{
                res.status(200).send({song: song});
            }
        }
    });

}

function saveSong(req,res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err,songStored) =>{

        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songStored){
                res.status(500).send({message: 'No se ha podido guardar la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }

    });

}

function getSongs(req,res){
    var albumId = req.params.id;

    if(!albumId){
        //mostrar todos los albums
        var find = Song.find({}).sort('number');
    }else{
        //mostrar los albums de un artista en particular
        var find = Song.find({album: albumId}).sort('number');
    }
    find.populate({
        path: 'album',
        populate: {
            path: 'artist', 
            model: 'Artist'}
        }).exec((err,songs)=>{
            if(err){
                res.status(500).send({message: 'Error en la peticion'}); 
            }else{
                if(!songs){
                    res.status(404).send({message: 'No existen canciones'});
                }else{
                    res.status(200).send({song: songs});
                }
            }
    });
}

function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update, (err,songUpdated)=>{

        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No existe la cancion'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }

    });

}

function deleteSong(req,res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId,(err, songRemoved )=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el cancion'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La cancion no ha sido eliminada'});
                        }else{
                            res.status(200).send({song: songRemoved});
                        }
                    }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var fileName = 'NoSubido';

    if(req.files){
        var filePath = req.files.file.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'mp3' || fileExt == 'ogg'){

            Song.findByIdAndUpdate(songId,{file: fileName},(err, songUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar la cancion'});
                }else{
                    if(!songUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar la cancion'});
                    }else{
                        res.status(200).send({song: songUpdated});
                    }
                }
            });

        }else{
            res.status(200).send({message: 'Extension del archivo no valido'});
        }
    }else{
        res.status(200).send({message: 'No ha subido ninguna cancion...'});
    }
}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/'+songFile;
    fs.exists(pathFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la cancion'});
        }
    });
}



module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};