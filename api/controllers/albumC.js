'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!album){
                res.status(404).send({message: 'No existe el album'});
            }else{
                res.status(200).send({album: album});
            }
        }
    });
}

function saveAlbum(req,res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored)=>{
        if(err){
            res.status(500).send({message: 'Error en el serividor'});  
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se pudo guardar el album'}); 
            }else{
                res.status(200).send({album: albumStored}); 
            }
        }
    });

}

function getAlbums(req, res){
    var artistId = req.params.id;

    if(!artistId){
        //mostrar todos los albums
        var find = Album.find({}).sort('title');
    }else{
        //mostrar los albums de un artista en particular
        var find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err,albums)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!albums){
                res.status(404).send({message: 'No existen el albums'});
            }else{
                res.status(200).send({albums: albums});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    //toma el id, los datos del body para actualizar
    Album.findByIdAndUpdate(albumId,update, (err, albumUpdated)=>{

        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'El artista no se ha actualizado'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }

    });
}

function deleteAlbum(req,res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId,(err, albumRemoved )=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{

                Song.find({Album: albumRemoved._id}).remove((err, songRemove )=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el cancion'});
                    }else{
                        if(!songRemove){
                            res.status(404).send({message: 'La cancion no ha sido eliminada'});
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });

            }
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var fileName = 'NoSubido';

    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){

            Album.findByIdAndUpdate(albumId,{image: fileName},(err, albumUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el album'});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el album'});
                    }else{
                        res.status(200).send({album: albumUpdated});
                    }
                }
            });

        }else{
            res.status(200).send({message: 'Extension del archivo no valido'});
        }
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen...'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/'+imageFile;
    fs.exists(pathFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}



module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}