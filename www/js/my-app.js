  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [ 

        { path: '/login-admin/', url: 'login-admin.html', },
        { path: '/index/', url: 'index.html', },
        { path: '/menu-admin/', url: 'menu-admin.html', },
        { path: '/crear-usuario/', url: 'crear-usuario.html', }
        
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// inicializar base de datos
db = firebase.firestore();

// referencia a la colección usuarios en nuestra DB
coleccion_usuarios = db.collection('usuarios');



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");   

    

});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})



// Page init correspondiente a la página index.html
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    
    console.log(e);
    console.log('Página index cargada!!');

    

    /*
    var data = {
        usuario: "usuario@hostelapp.com", 
        contraseña: "36a623s432as",
        perfil: "usuario"
    };

    db.collection("usuarios").doc("usuario@hostelapp.com").set(data)
    .then(function(docRef) { // .then((docRef) => {
    console.log("documento cargado ??");
    })
    .catch(function(error) { // .catch((error) => {
    console.log("Error: " + error);
    });

    */
    
    $$('#btnIngresar').on('click', function(){
        

        // autenticación del usuario y contraseña
        var email = $$('#usuarioLogin').val();
        var password = $$('#passLogin').val();

        //BASE DE DATOS
        // Recuperamos usuario para usarlo como ID y recuperar datos de nuestra DB
        var id_usuario = email;
        console.log(id_usuario);
        // Hacemos referencia a un documento utilizando id_usuario
        var docRef = coleccion_usuarios.doc(id_usuario);

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in
            // Traemos datos de ese documento que específicamos
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log('El documento existe!');
                    console.log("Document data:", doc.data().perfil);
                    console.log("Document data:", doc.data().usuario);
                    console.log("Document data:", doc.data().contraseña);

                    perfil_login = doc.data().perfil;

                    if(perfil_login == 'admin'){

                        console.log('El usuario es un ADMINISTRADOR');

                        } else if(perfil_login == 'usuario'){

                            console.log('El usuario es un USUARIO');
                    }

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
            // ...
          })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
          });


        




        

        

        


    });

    

    

})

















// Page init correspondiente a la página login-admin.html
$$(document).on('page:init', '.page[data-name="login-admin"]', function (e) {
    
    console.log(e);
    console.log('Página Login-admin cargada!');
    
    

})

// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="menu-admin"]', function (e) {
    
    console.log(e);
    console.log('Página menu-admin cargada!');
    
    
    

})

// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="crear-usuario"]', function (e) {
    
    console.log(e);
    
    
    

})









