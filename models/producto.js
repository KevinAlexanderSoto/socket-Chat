const { Schema, model } = require('mongoose');
// modelo para base de datos 
const ProductoSchema = Schema({
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
    },
    precio : {
        type : Number,
        default : 0
    },
    categoria : {
        type : Schema.Types.ObjectId,
        ref : 'Categoria',
        require : true
    },
    descripcion : {
        type : String,
    },
    disponible : {
        type :Boolean,
        default : true
    }
,
    img : {
        type : String
    } 

});

ProductoSchema.methods.toJSON = function(){
    const {__v , estado,...data} = this.toObject();
    return data;
}

module.exports = model('Producto',ProductoSchema);// Export con s EXPORTS 