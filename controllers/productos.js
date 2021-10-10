const { response, request } = require("express");
const { Producto } = require("../models");

const crearProducto = async (req,res=response)=>{
    const {nombre,precio,categoria,descripcion,disponible}=req.body;
    const productoDB = await Producto.findOne({nombre: nombre});
    
    if (productoDB) {
        return res.status(400).json({msg : 'el producto ya existe '});
    }

    const data1 ={
        nombre,
        precio,
        categoria,
        descripcion,
        disponible,
        usuario : req.usuario._id 
    }

     const producto = new Producto(data1);


    await producto.save(); 
   res.status(201).json(producto);

};

const obtenerProductos = async(req,res=response)=>{

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };// para que no muestre los borrados

    const [ total, producto ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .populate('usuario','nombre')
            .populate('categoria','nombre') 
            
    ]);

    res.status(200).json({
        total,
        producto
    });

};

const obtenerProducto = async (req=request,res=response)=>{

    const {id} = req.params;

    const prod = await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');
    
    
res.status(200).json(prod);

};

const actualizarProducto = async(req=request,res=response)=>{
    const {estado,usuario,...data} = req.body;
    const {id}= req.params;

    data.usuario = req.usuario._id;

const result = await Producto.findByIdAndUpdate(id,data,{new : true});

res.status(200).json(result);
};

const borrarProducto = async (req,res=response)=>{

    const {id } = req.params;
    
   const deleted = await Producto.findByIdAndUpdate(id,{estado : false},{new : true});

res.status(200).json(deleted);
};
module.exports= {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}