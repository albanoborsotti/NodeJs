'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
    //res.status(200).send({message: 'Metodo getArtist'});
    var artistId = req.params.id;

    Artist.findById(artistId,(err, artist)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    
    var itemsPerPage = 3;
    
    Artist.find().sort('name').paginate(page, itemsPerPage,(err, artists, total)=>{

        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No hay Artistas'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }

    });
}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    //toma el id, los datos del body para actualizar
    Artist.findByIdAndUpdate(artistId,update, (err, artistUpdated)=>{

        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no se ha actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }

    });
}

function saveArtist(req, res){
    var artist = new Artist();
    
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.gender = params.gender;
    artist.image = 'null';

    artist.save((err,artistStored) =>{

        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }

    });

}

function deleteArtist(req,res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId,(err,artistRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{ 
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved )=>{
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
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });

                        }
                    }
                });
            }
        }
    });

}

function uploadImage(req, res){
    var artistId = req.params.id;
    var fileName = 'NoSubido';

    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){

            Artist.findByIdAndUpdate(artistId,{image: fileName},(err, artistUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({artist: artistUpdated});
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
    var pathFile = './uploads/artists/'+imageFile;
    fs.exists(pathFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};