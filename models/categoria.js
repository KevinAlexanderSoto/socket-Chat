const { Schema, model } = require('mongoose');
// modelo para base de datos 
const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado :{
        type : Boolean,
        default : true,// por defecto activado
        require : true
    },
    usuario : {
        type : Schema.Types.ObjectId, //para decirle que es de mongo,para el U que creo la cat
        ref : 'Usuario',
        require: true
    }
});


module.exports = model( 'Categoria', CategoriaSchema  );
