'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req,res){
    res.status(200).send( 
        {message: 'Test controlador de usuarios con MongoDB y NodeJs'}
    );
}

function saveUser(req, res){
    var user = new User();
    
    var params = req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN'; 
    user.image = 'null';
    if(params.password){
        //encriptar contraseña y grabar datos
        bcrypt.hash(params.password,null,null, function(err,hash){
            user.password = hash;
            if(user.name !=null & user.surname !=null & user.email !=null){
                //guardar el usuario
                user.save((err,userStore)=>{
                    if(err){
                        res.status(500).send({message: 'Error al guardar los datos'});
                    }else{
                        if(!userStore){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStore});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Completa todos los campos'});
            }
        });
    }else{
        res.status(500).send({message: 'Introduce la contraseña'})
    }
}

function loginUser(req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},(err,user)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                //comprobar contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devolver datos del usuario
                        if(params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var  update = req.body;

    User.findByIdAndUpdate(userId, update, (err,userUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var fileName = 'NoSubido';

    if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){

            User.findByIdAndUpdate(userId,{image: fileName},(err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({user: userUpdated, image: fileName});
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
    var pathFile = './uploads/users/'+imageFile;
    fs.exists(pathFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

module.exports ={
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};