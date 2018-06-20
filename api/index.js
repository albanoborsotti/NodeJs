'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_node',(err,res)=>
{
    if(err){
        throw err;
    }else{
        console.log("La base de datos esta funcionando correctamente");
        app.listen(port, function(){
            console.log("Servidor online");
        })
    }
})