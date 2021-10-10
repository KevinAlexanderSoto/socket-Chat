
// referencias HTML 
const form = document.querySelector('form');

// para hacer fecht autenticacion con google y Manual segun el entorno
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';//colocar el endpoint de produccion


     // para el login manual        
    form.addEventListener('submit',event =>{
        event.preventDefault();

        const data = {};
        
        for (const i of form.elements) {
            // para ignorar el button 
            if (i.name.length > 0) {
                data[i.name] = i.value;
            }
        }

        fetch(url + 'login',{
            method : 'POST',
            body : JSON.stringify(data),
            headers : {'Content-Type' : 'application/json'}
        })
        .then(resp => resp.json())
        .then(({msg,token}) =>{
            if (msg) { // hay error
                return console.error(msg);
            }

            // si todo sale bien , se guarda el token 

            localStorage.setItem('token',token);

            // redirecciona luego de iniciar seccion corectamente
            window.location = 'chat.html';
        })
        .catch(err => console.log(err));
    });

function onSignIn(googleUser) {

   /*  var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( ({token})=> {
       localStorage.setItem('token',token); // guardar token en lado del cliente
        
            // redirecciona luego de iniciar seccion corectamente
            window.location = 'chat.html';
    
    } )
    .catch( err => console.log (err));
    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}