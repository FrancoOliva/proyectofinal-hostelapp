  
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

        
        { path: '/index/', url: 'index.html', },
        { path: '/menu-admin/', url: 'menu-admin.html', },
        { path: '/menu-usuario/', url: 'menu-usuario.html',},
        { path: '/crear-usuario/', url: 'crear-usuario.html',},
        { path: '/registrar-cliente/', url: 'registrar-cliente.html',},
        { path: '/dar-de-baja/', url: 'dar-de-baja.html', },
        { path: '/avisos-usuario/', url: 'avisos-usuario.html', },
        { path: '/habitaciones/', url: 'habitaciones.html', },
        { path: '/registrar-pago/', url: 'registrar-pago.html', }
        
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// inicializar base de datos
db = firebase.firestore();

// referencia a la colección usuarios en nuestra DB
coleccion_usuarios = db.collection('usuarios');
coleccion_camasOcupadas = db.collection('camasOcupadas');
coleccion_clientes = db.collection('clientes');

// perfil del usuario conectado
var perfil = "";

// página avisos-usuario ID's
var texto1 = "";
var texto2 = "";

var btn1 = "";
var btn2 = "";

var ruta1 = ""
var ruta2 = ""

var id_cama = "";



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
            
            // Traemos datos de ese documento que específicamos
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log('El documento existe!');

                    perfil_login = doc.data().perfil;

                    if(perfil_login == 'admin'){

                        console.log('Perfil: ADMINISTRADOR');
                        perfil = "admin";
                        mainView.router.navigate('/menu-admin/');

                        } else if(perfil_login == 'usuario'){

                            console.log('Perfil: USUARIO');
                            perfil = "usuario";
                            mainView.router.navigate('/menu-usuario/');

                        } else if (perfil_login == "baja"){
                        console.log('Usuario dado de baja!');
                        $$('#mensajeLogin').html('Este usuario fue dado de baja por un administrador.');
                        
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
            console.log(errorCode);
            console.log(errorMessage);
            if(errorCode == "auth/wrong-password"){
                $$('#mensajeLogin').html('La contraseña es incorrecta!');
            } else if (errorCode == "auth/user-not-found"){
                $$('#mensajeLogin').html('Este usuario no puede ser identificado. Quizás no existe o fue borrado.');
            }
          });

    });

})


// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="menu-admin"]', function (e) {
    
    console.log(e);
    console.log('Página menu-admin cargada!');

    // botones del mneú admin
    $$('#btnCrearUsuario').on('click', function(){
        console.log("Selección: Crear usuario!");
        mainView.router.navigate('/crear-usuario/');
    });
    
    $$('#btnDarBaja').on('click', function(){
        console.log("Selección: Dar de baja!");
        mainView.router.navigate('/dar-de-baja/');
    });

    $$('#btnAdminRegistrar').on('click', function(){
        console.log("Selección: Registrar clientes");
        mainView.router.navigate('/registrar-cliente/');
    });

    $$('#btnAdminBuscarClientes').on('click', function(){
        console.log("Selección: Buscar clientes");
    });

    $$('#btnAdminRegistrarPago').on('click', function(){
        console.log("Selección: Registrar un pago!");
        mainView.router.navigate('/registrar-pago/');
    });

    $$('#btnAdminRegistrarGasto').on('click', function(){
        console.log("Selección: Registrar un gasto!");
    });


})

// Page init correspondiente a la página menu-usuario.html
$$(document).on('page:init', '.page[data-name="menu-usuario"]', function (e) {
    
    console.log(e);
    console.log('Página menu-usuario cargada!');

    // botones del menú usuario

    $$('#btnHabitaciones').on('click', function(){
        console.log('Selección: ver habitaciones.');
        
        mainView.router.navigate('/habitaciones/');
    });

    $$('#btnRegistrarCliente').on('click', function(){
        console.log('Selección: registrar cliente.');
        
        mainView.router.navigate('/registrar-cliente/');
    });

    
    

    $$('#rp_cliente').on('click', function(){
        mainView.router.navigate('/registrar-pago/');
    });

    


})

// Page init correspondiente a la página crear-usuario.html
$$(document).on('page:init', '.page[data-name="crear-usuario"]', function (e) {
    
    console.log(e);
    
    $$('#btnAdminAceptar').on('click', function(){
        
        var email = $$('#crearUsuario').val();
        var password = $$('#crearPass').val();
        var perfil = $$('#crearPerfil').val();

        console.log(email);
        console.log(password);
        console.log(perfil);

        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((user) => {
            console.log('Usuario creado correctamente!');
            
                // JSON con los datos del usuario
                var data = {
                    usuario: email,                    
                    perfil: perfil
                    };

                var id = email;

                // los datos del usuario ingresado en auth se guardan en la db
                db.collection("usuarios").doc(id).set(data)
                .then(function(docRef) { // .then((docRef) => {
                    
                    console.log("Documento cargado en la DB correctamente!");

                    
                })
                .catch(function(error) { // .catch((error) => {
                    console.log("Error: " + error);
                });

                // una vez creado el usuario y guardado en la db
                // modificar y cargar los datos de avisos-usuario.html
                
                texto1 = "Datos guardados";
                texto2 = "El usuario fue creado con éxito!";

                btn1 = "Crear usuario";
                btn2 = "Menú principal";

                ruta1 = "/crear-usuario/";
                ruta2 = "/menu-admin/";          

                mainView.router.navigate('/avisos-usuario/');


          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
          });

    });
    
})

// Page init correspondiente a la página dar-de-baja.html
$$(document).on('page:init', '.page[data-name="dar-de-baja"]', function (e) {
    
    console.log(e);
    console.log('Página dar-de-baja cargada!');

    $$('#btnAdminDarDeBaja').on('click',function(){
        
        // le pedimos al admin que ingrese los datos del usuario que quiere dar de baja
        
        var id = $$('#ddbUsuario').val();
        var act_perfil = $$('#ddbPerfil').val();

        coleccion_usuarios.doc(id).update
            ({ perfil: act_perfil })
            .then(function() {

            console.log("Perfil modificado. Usuario dado de baja!");

            })
            .catch(function(error) {

            console.log("Error: " + error);

            });

            texto1 = "Usuario dado de baja";
            texto2 = "Este usuario no podrá conectarse de nuevo sin la autorización de un administrador.";

            btn1 = "Dar de baja";
            btn2 = "Menú principal";

            ruta1 = "/dar-de-baja/"
            ruta2 = "/menu-admin/"

            mainView.router.navigate('/avisos-usuario/');

    });    
    

})

// Page init correspondiente a la página registrar-cliente.html
$$(document).on('page:init', '.page[data-name="registrar-cliente"]', function (e) {
    
    console.log(e);
    console.log('Página registrar-cliente cargada!');

    $$('#btnAceptar').on('click', function(){
        
        var nombreCliente = $$('#c_nombre').val();
        var apellidoCliente = $$('#c_apellido').val();
        var dni_pasaporteCliente = $$('#c_dnipasaporte').val();
        var fNacimientoCliente = $$('#c_fNacimiento').val();
        var paisCliente = $$('#c_pais').val();
        var ocupacionCliente = $$('#c_ocupación').val();
        var emailCliente = $$('#c_email').val();
        var fRegistroCliente = $$('#c_fIngreso').val();

        var data = {
        nombre: nombreCliente,
        apellido: apellidoCliente,
        dni_pasaporte: dni_pasaporteCliente,
        fNacimiento: fNacimientoCliente,
        pais: paisCliente,
        ocupacion: ocupacionCliente,
        email: emailCliente,
        fRegistro: fRegistroCliente
        };

        var id = dni_pasaporteCliente;

        db.collection("clientes").doc(id).set(data)
        .then(function(docRef) { // .then((docRef) => {
        console.log("CLIENTE CARGADO EN LA BASE DE DATOS");
        })
        .catch(function(error) { // .catch((error) => {
        console.log("Error: " + error);
        });

        texto1 = "Datos guardados";
        texto2 = "El cliente fue cargado con éxito!";

        btn1 = "Crear usuario";
        btn2 = "Menú principal";

        // las rutas de los botones se definen según el perfil
        // que esté cargando al nuevo cliente
        if(perfil == "admin"){
            ruta1 = "/registrar-cliente/"
            ruta2 = "/menu-admin/"

            mainView.router.navigate('/avisos-usuario/');

        } else {
            ruta1 = "/registrar-cliente/"
            ruta2 = "/menu-usuario/"

            mainView.router.navigate('/avisos-usuario/');
        }

    });

})

// Page init correspondiente a la página avisos-usuario.html
$$(document).on('page:init', '.page[data-name="avisos-usuario"]', function (e) {
    
    console.log(e);
    console.log('Página avisos-usuario cargada!');

    $$('#texto1').html(texto1);
    $$('#texto2').html(texto2);

    $$('#btn1').html(btn1);
    $$('#btn2').html(btn2);

    
    // botones aceptar y menu principal
    $$('#btn1').on('click', function(){
        mainView.router.navigate(ruta1);
    });

    $$('#btn2').on('click', function(){
        mainView.router.navigate(ruta2);
    });
    

})



// Page init correspondiente a la página habitaciones.html
$$(document).on('page:init', '.page[data-name="habitaciones"]', function (e) {
    
    console.log(e);
    console.log('Página habitaciones cargada!');
    

    $$('#btnMP').on('click', function(){
        mainView.router.navigate('/menu-usuario/');
    });



})  



// Page init correspondiente a la página registrar-pago.html
$$(document).on('page:init', '.page[data-name="registrar-pago"]', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
    console.log("Página registrar-pago cargada!");
    var id_cliente = "";

    $$('#rp_btnBuscarID').on('click', function(){
        
        id_cliente = $$('#rp_idCliente').val();
        // utilizamos la variable id_cliente
        // para buscar información en la base de datos
        var docRef = coleccion_clientes.doc(id_cliente);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Documento encontrado!");
                console.log("Document data:", doc.data());

                nombreCliente = doc.data().nombre;
                apellidoCliente = doc.data().apellido;
                fechaIngreso = doc.data().fRegistro;

                console.log(nombreCliente);
                console.log(apellidoCliente);
                console.log(fechaIngreso);

                $$('#rp_nCliente').val(nombreCliente);
                $$('#rp_aCliente').val(apellidoCliente);
                $$('#rp_fIngreso').val(fechaIngreso);

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            });

    $$('#rp_aceptar').on('click', function(){

        // se pasan los valores de los inputs a variables
        // para guardarlos en la base de datos
        var nombre          = $$('#rp_nCliente').val(); 
        var apellido        = $$('#rp_aCliente').val();
        var fechaIngreso    = $$('#rp_fIngreso').val();
        var fechaPartida    = $$('#rp_fPartida').val();
        var importe         = $$('#rp_importe').val();
        var formaDePago     = $$('#rp_fdPago').val();

        // objeto JSON con los datos que vamos a guardar en la base de datos
        var data = {
            nombre: nombre,
            apellido: apellido,
            fechaIngreso: fechaIngreso,
            fechaPartida: fechaPartida,
            importe: importe,
            formaDePago: formaDePago,
        };

        // Añadir un documento nuevo a la colección "registroDePagos"
        db.collection("registro_pagos").doc(id_cliente).set(data)
        .then(() => {
            console.log("Document successfully written!");
            console.log('Documento guardado con éxito!');


        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            alert("Error: no se puede avanzar porque el pago no pudo registrarse.");
        });
        
        texto1 = "Pago registrado";
            texto2 = "El pago del cliente fue cargado correctamente!";

            btn1 = "Registrar pago";
            btn2 = "Menú principal";

            if(perfil == "usuario"){
                ruta1 = "/registrar-pago/";
                ruta2 = "/menu-usuario/";
            } else {
                ruta1 = "/registrar-pago/";
                ruta2 = "/menu-admin/";
            }

            mainView.router.navigate('/avisos-usuario/');


        

        
    });

})     

