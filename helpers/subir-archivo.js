const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = async (files,extencionesValidas = ['jpg','png', 'gif'], carpeta = '' )=>{

    return new Promise((resolve,reject )=>{
        
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        //validar la extension 
        if (!extencionesValidas.includes(extension)) {
          //TODO: Se deberia hacer insencible a mayusculas y minusculas 
            return reject( `La extension ${extension} no es permitida`); 
        }
        // hacer el nombre de cada archivo diferente, para evitar repetirse 
        const temporalName = uuidv4() +'.'+ extension;
    
        // aqui se guardara el archivo subido
        const uploadPath = path.join(__dirname,'../uploads/',carpeta,temporalName);
      
        archivo.mv(uploadPath,(err) => {
          //callback 
            if (err) {
            return reject(err);
          }
      
          resolve(temporalName );
        });

    });

};



module.exports = {
    subirArchivo
}