const { response } = require("express");

const {Usuario,Categoria,Producto} = require('../models');
const {ObjectId}= require("mongoose").Types;
const coleccionesPermitidas = [ // para validar colecciones 
'usuarios',
'categorias',
'productos',
'roles'

];

const buscarUsuarios = async (termino = '',res)=>{
    
    const ismongoid = await ObjectId.isValid(termino);
        
if (ismongoid) {
    const usuario = await Usuario.findById(termino);
    return res.status(200).json({results : (usuario ) ? [usuario] : []});
}

const regex = new RegExp(termino,'i');//expresion regular para hacer el termino insensible a mayusculas y minusculas

const usuarios = await Usuario.find({
    $or :[ {nombre : regex }, {correo : regex}],
    $and : [{ estado : true}] // una condicion u otra con mongo y and  
});

res.status(200).json({results : (usuarios ) ? [usuarios] : []});


};

const buscarCategorias = async (parametro='' , res)=>{

    const ismongo = await ObjectId.isValid(parametro);

    if (ismongo) {
        cat = await Categoria.findById(parametro);
        console.log(cat);
        return res.status(200).json({results : (cat) ? [cat ] : []});

    }

    const exreg = new RegExp(parametro,'i');

    const categorias = await Categoria.find({nombre : exreg , estado :true})
    console.log(categorias);

    res.status(200).json({
        results : (categorias) ? [categorias] : []
    });
};

const buscarProductos = async (parametro , res) =>{
    let regexp = '';
    const ismongo = await ObjectId.isValid(parametro);
    if (ismongo) {
        const producto = await (await Producto.findById(parametro)).populate('categoria','nombre');

        return res.status(200).json({results : (producto) ? [producto] : []});
    }

    if (isNaN(parametro)) {
       
        regexp = new RegExp(parametro,'i');    
    }else{
        
        regexp = parseInt(parametro,10);
    }
    ;
    

    const result = await Producto.find({
        $or : [ {nombre : regexp},{descripcion : regexp}, {precio : (isNaN(regexp)) ? (-1) : regexp }],
        $and :[{estado : true}]
    }).populate('categoria','nombre');
    res.status(200).json({results : (result) ? [result] : []});
};

const buscar=(req,res=response)=>{
    const {coleccion,termino}=req.params;
    
    if (!coleccionesPermitidas.includes(coleccion)) {
        
        return res.status(400).json({msg:"la coleccion no existe"});
    }
    
    switch (coleccion) {
        case  'usuarios' :
        
            buscarUsuarios(termino,res);
        break

        case  'categorias':
            buscarCategorias(termino,res);
        break;
        case 'productos':
            buscarProductos(termino,res);
        break;
    }

    
    
}



module.exports = {
    buscar
}