// propias de NODE
const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;

const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivo = async (req = request, res = response) => {
  // para subir imagenes
  // const result = await subirArchivo(req.files ,undefined , 'imgs');

  try {
    // para subir txt o md
    const result = await subirArchivo(req.files, ["TXT", "md"], "textos");
    res.json({ result });
  } catch (error) {
    // para manejar el error correctamente
    res.status(400).json({ error });
  }
};

const actualizarImg = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el usuario no existe , verifique el ID" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el Producto no existe , verifique el ID" });
      }

      break;
    default:
      return res.status(500).json({ msg: "falta validar esto" });
  }

  try {
    if (modelo.img) {
      const deletePath = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(deletePath)) {
        fs.unlinkSync(deletePath);
      }
    }
  } catch (error) {
    throw new Error("error borrando img antigua" + error);
  }

  const result = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = result;

  await modelo.save();

  res.json(modelo);
};

const actualizarImgCloudinary = async (req, res = response) => {
  
  const { coleccion, id } = req.params;

  let modelo;
//discrimina la coleccion 
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el usuario no existe , verifique el ID" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el Producto no existe , verifique el ID" });
      }

      break;
    default:
      return res.status(500).json({ msg: "falta validar esto" });
  }
        const extencionesValidas = ['png','jpg'];
        const {archivo} = req.files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        //validar la extension 
        if (!extencionesValidas.includes(extension)) {
           
            return res.status(400).json({msg : `La extension ${extension} no es permitida`});
        }

  try {
    // para borrar la img anterior 
    if (modelo.img) {
      const nombreArray= modelo.img.split('/');
      
      const nombre = nombreArray[nombreArray.length - 1];
      
      const [public_id] = nombre.split('.');

      cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    throw new Error("error borrando img antigua" + error);
  }

  const {tempFilePath} = req.files.archivo;
//subir a cloudinary
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el usuario no existe , verifique el ID" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el Producto no existe , verifique el ID" });
      }

      break;
    default:
      return res.status(500).json({ msg: "falta validar esto" });
  }

  try {
    if (modelo.img) {
      const pathimagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      );
      if (fs.existsSync(pathimagen)) {
        return res.sendFile(pathimagen);
      }
    }
  } catch (error) {
    throw new Error("error img " + error);
  }

  const generalImg = path.join(__dirname, "../assets", "no-image.jpg");
  res.sendFile(generalImg);
};


const mostrarImagenCloudinary = async (req, res = response) => {
  
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el usuario no existe , verifique el ID" });
      }

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: "el Producto no existe , verifique el ID" });
      }

      break;
    default:
      return res.status(500).json({ msg: "falta validar esto" });
  }

  try {
    if (modelo.img) {
      // tambien se puede retornar el url de la img para el frontend 
      return res.redirect(modelo.img)
    }
  } catch (error) {
    throw new Error("error img " + error);
  }

  const generalImg = path.join(__dirname, "../assets", "no-image.jpg");
  res.sendFile(generalImg);
};

module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImagen,
  actualizarImgCloudinary,
  mostrarImagenCloudinary
};
