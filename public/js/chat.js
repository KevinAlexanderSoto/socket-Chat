// referencias HTML 
const txtUid = document.querySelector("#txtUid");
const txtmsg = document.querySelector("#txtmsg");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensaje = document.querySelector("#ulMensaje");
const btnSalir = document.querySelector("#btnSalir");


const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://restserver-curso-fher.herokuapp.com/api/auth/";

let usuario = null;
let socket = null;

// revisar el JWT local contra el SERVER
const validarJWT = async () => {
  const tokenLocal = localStorage.getItem("token") || "";
  // revisamos si hay token o token valido
  if (tokenLocal.length < 10) {
    window.location = "index.html";
    throw new Error("No hay un token valido ");
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-Type": "application/json", "x-token": tokenLocal },
    });

    // extrer datos y renombrarlos
    const { usuario: usuarioDB, token: tokenDB } = await res.json();

    // se refresca el token
    localStorage.setItem("token", tokenDB);

    usuario = usuarioDB;

    await conectSocket();
  } catch (error) {
    console.log(error);
  }
};

const conectSocket = async () => {
   socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on('connection',()=>{
    console.log('Usuario conectado');
  });
  
  socket.on('disconnect',()=>{
    /* window.location = 'index.html'; */
    console.log('Usuario desconectado');
  });

  socket.on('recibir-mensaje', mostrarMensajes);
  
  socket.on('usuarios conectados',mostrarUsuarios);
  
  socket.on('msg privado',(payload)=>{//TODO
    console.log(payload);
  });
};


const mostrarUsuarios =(payload)=>{
  
  let userhtml = '';
  payload.forEach(({nombre,uid}) => {
    userhtml =  `
    <li> 
    <p>${nombre}</p>
    <p >${uid}</p>
    </li>` + userhtml 
    
  });
  ulUsuarios.innerHTML = userhtml;

};

const mostrarMensajes = (payload)=>{
 var msghtml = '';
payload.forEach(({nombre,uid,msg})=>{
  msghtml = `
  <li> 
    <p class = "text-primary">${nombre} con id : ${uid}</p>
    <p >${msg}</p>
    </li>` + msghtml 
 
});
ulMensaje.innerHTML = msghtml;
};

txtmsg.addEventListener('keyup',({keyCode})=>{

if (keyCode !== 13) {return}

const mensaje = txtmsg.value;

const id = txtUid.value;
if (txtmsg.length === 0) {
  return
}

socket.emit('enviar-mensaje',{mensaje,id});
txtmsg.value = '';
});
const main = async () => {
  // validar JWT para esta pantalla
  await validarJWT();
};

main();
