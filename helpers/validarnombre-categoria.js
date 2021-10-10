const { Categoria } = require("../models")


const validarnombre = async(nombreconsulta)=>{

    nombreconsulta = nombreconsulta.toUpperCase();
    const data = await Categoria.findOne({nombre : nombreconsulta});
    if (data) {
        throw new Error('el nombre ya existe')
    }

}


const validarid = async(idconsulta)=>{
    
    const data = await Categoria.findOne({_id : idconsulta});
    if (!data) {
        throw new Error('la categoria no existe')
    }

}

module.exports = {
    validarnombre,
    validarid
}