const {Producto} = require('../models');


const validaridProducto = async(idconsulta)=>{
   
    const data = await Producto.findOne({_id : idconsulta});
    if (!data) {
        throw new Error('el producto no existe')
    }



}

const existeproducto = async(req,res,next)=>{// midleware para validar que id no esta borrado
const {id }= req.params;

const result = await Producto.findById(id);

if (!result.estado) {
    return res.status(401).json({
        msg: `este id no existe`
    });
}

next();


}

module.exports = {
    validaridProducto,
    existeproducto

}