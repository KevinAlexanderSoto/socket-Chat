const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}

const confirJWT = async (frondtoken)=>{
try {
    if (frondtoken < 15) {
        return null
    }
    const {uid} = jwt.verify(frondtoken,process.env.SECRETORPRIVATEKEY);
    
    const user = await usuario.findById(uid);

    // verificamos que el usuario exista y no este borrado 
        if (user && user.estado) {
            return user
        }else{
            return null ;
        };
} catch (error) {
    return null;    
}

};



module.exports = {
    generarJWT,
    confirJWT

}

