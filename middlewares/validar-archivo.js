const { response } = require("express");

const validarArchivo = (req,res = response ,next)=>{
 
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg : "no hay archivos que subir  "});
        return;
      }
      
      if (!req.files.archivo) {// tiene que venir argo con nombre archivo 
          res.status(400).json({msg : "no hay archivos que subir,o la key del form-data no se llama archivo "});
          return;
        }
    next();    
};


module.exports = {
    validarArchivo
}