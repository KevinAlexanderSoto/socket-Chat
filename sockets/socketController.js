const { confirJWT } = require("../helpers/generar-jwt");
const {ChatMensaje}=require("../models");

const chatmsg = new ChatMensaje();

const socketController = async (client,io) => {
  const usuario = await confirJWT(client.handshake.headers["x-token"]);
  if (!usuario) {
    return client.disconnect();
  }
  // agregar usuario conectado
  chatmsg.conectarUsuario(usuario);

  // crear sala para usuario
  client.join(usuario.id); // hay 3 salas , global , socket.id , usuario.id

  // para emitirlo a todos los usuarios 
  io.emit('usuarios conectados',chatmsg.usuariosArr);

  // limpiar cuando alguien se desconecta 
    client.on('disconnect',()=>{
        chatmsg.desconectarUsuario(usuario._id);
        io.emit('usuarios conectados',chatmsg.usuariosArr);
    });

   // recibir msg global del frond
   client.on('enviar-mensaje',({uid,mensaje}) =>{
    
    //si se recibe msg Privado 
    if (uid) {
      client.to(uid).emit('msg privado',{"de":usuario.nombre , "msg":mensaje});
      return;
    }

    chatmsg.enviarMSG(usuario.id,usuario.nombre,mensaje);

    io.emit('recibir-mensaje',chatmsg.Ultimos12);

   });
};

module.exports = { socketController };
