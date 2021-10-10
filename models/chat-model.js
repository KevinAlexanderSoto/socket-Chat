
class Mensaje{
    constructor(uid,nombre,msg){     
    this.uid =uid; 
    this.nombre =nombre; 
    this.msg =msg;    
    
    }
}

class ChatMensajes{

    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    };

    get Ultimos12(){
        this.mensajes = this.mensajes.splice(0,12);
        return this.mensajes;
    };

    get usuariosArr(){

        return Object.values(this.usuarios)// los retorna como un arreglo [{},{},{},{}]

    };

    enviarMSG( uid,nombre,msg){
        this.mensajes.unshift(
            new Mensaje(uid,nombre,msg));
    };

    conectarUsuario(usuario){
        this.usuarios[usuario.id] = usuario;
    };

    desconectarUsuario(id){
        delete this.usuarios[id];// para borrar un elemento del objeto
    }
};

module.exports = ChatMensajes ; 