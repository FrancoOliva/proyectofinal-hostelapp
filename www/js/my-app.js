  
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


    $$('#btnAdmin').on('click', function(){
        mainView.router.navigate('/login-admin/');
    });

})

// Page init correspondiente a la página login-admin.html
$$(document).on('page:init', '.page[data-name="login-admin"]', function (e) {
    
    console.log(e);
    console.log('Página Login-admin cargada!');
    
    $$('#btnIngresarAdmin').on('click', function(){

        email = $$('#usuarioAdmin').val();
        password = $$('#passAdmin').val();

        firebase.auth().signInWithEmailAndPassword(email, password)
          .then((user) => {
            // Signed in
            mainView.router.navigate('/menu-admin/');
            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
          });
                
            });

})

// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="menu-admin"]', function (e) {
    
    console.log(e);
    
    
    $$('#btnCrearUsuario').on('click', function(){
        
        mainView.router.navigate('/crear-usuario/');

    });

})

// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="crear-usuario"]', function (e) {
    
    console.log(e);
    
    
    $$('#cu_btnAceptar').on('click', function(){

        email = $$('#cu_usuario').val();
        password = $$('#cu_pass').val();
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((user) => {
            // Signed in
            console.log('USUARIO CREADO CORRECTAMENTE. VER FIREBASE!');
            mainView.router.navigate('/menu-admin/');
            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
          });

    });

})









