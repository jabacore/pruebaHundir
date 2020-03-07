const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
    
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/hundirlaflotadb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect('mongodb+srv://javato:javato1234@dbhundirflota-kiezi.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
let jugadorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        maxlength:20,
        trim: true
    },
    intentos: {
        type: Number,
        min: 0,
        max: 40,
        required: true,
    },
    tiempo: {
        type: String,
        required: true
    }
});


let Jugador = mongoose.model('jugadores', jugadorSchema);
let app = express();

app.get('/jugadores', (request, response)=>{
    Jugador.find().then(result => {
        response.send(result)
    });
});

app.get('/jugadores/:id', (request, response)=>{
    Jugador.findById(request.params.id).then(result => {
        let data;
        if (result) {
            data = {error: false, result: result}
        } else {
            data = {error: true, errorMessage: "No encontrado"}
        }
        response.send(data)
    }).catch(error => {
        data = {error: true, errorMessage: "Error"}
        response.send(data)
    });
});

//Agregar datos con solicitudes POST
app.use(bodyParser.json())
app.post('/jugadores', (request, response) => {
    let newJugador = new Jugador({
        nombre: request.body.nombre,
        intentos: request.body.intentos,
        tiempo: request.body.tiempo,
    });
    newJugador.save().then(result => {
        let data = {error:false, result: result}
        response.send(data);
    }).catch(error =>{
        let data =  {error:true, errorMessage: "Error al guardar"}
        response.send(data);
    });

});

//Actualizacion de datos con solicitudes PUT
app.put('/jugadores/:id', (request, response)=>{
    Jugador.findByIdAndUpdate(request.params.id, {
        $set: {
            nombre: request.body.nombre,
            intentos: request.body.intentos,
            tiempo: request.body.tiempo,
        }
    }, {new:true}).then(result=>{
        let data =  {error:false, result: result}
        response.send(data);
    }).catch(error=>{
        let data =  {error:true, errorMessage: "error al actualizar"}
        response.send(data);
    })
})

//Eliminacion de datos con solicitudes DELETE
app.delete('/jugadores/:id', (request, response)=>{
    Jugador.findByIdAndRemove(request.params.id).then(result=>{
        let data =  {error:false, result: result}
        response.send(data);
    }).catch(error=>{
        let data =  {error:true, errorMessage: "Error eliminar jugadores"}
        response.send(data);
    })
})

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), ()=> {
    console.log(`servidor corriendo en el puerto ${app.get('port')}`);
});
