  
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
coleccion_clientes = db.collection('clientes');
coleccion_habMatrimonial = db.collection('habitacionMatrimonial');
coleccion_registro_pagos = db.collection('registro_pagos');

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

    $$('#btnAdminHabitaciones').on('click', function(){
        console.log('Página habitaciones cargada!');
        mainView.router.navigate('/habitaciones/');
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

    $$('#btnAdminVolver').on('click', function(){
        mainView.router.navigate('/menu-admin/');
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

    // variables para capturar información del ocupante nuevo
    var estado = "";
    var nombre = "";
    var fIngreso = "";
    var fPartida = "";
    var estaOcupada = false;

    // RECUPERAMOS INFO DE LA CAMA QUE VAMOS A USAR DE LA BASE DE DATOS    
    var camaMatrimonial = coleccion_habMatrimonial.doc("1_cm");    

    camaMatrimonial.get().then((doc) => {
        if (doc.exists) {
            console.log("El documento existe!");
            console.log("Document data:", doc.data());

            $$('#estado_cama').html("Estado: " + doc.data().estado);
            $$('#ocupada_por').html("Nombre: " + doc.data().nombre);
            $$('#fIngreso').html("Fecha de ingreso: " + doc.data().fIngreso);
            $$('#fPartida').html("Fecha de partida: " + doc.data().fPartida);



        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    
    $$('#btnLiberarCama').on('click', function(){

        // si no hay ocupantes, reiniciamos la información de la cama
        // en la base de datos y en la página
        coleccion_habMatrimonial.doc("1_cm").update
        ({  estado: "Libre",
            nombre: "-",
            fIngreso: "-",
            fPartida:"-" })
        .then(function() {

        console.log("Info de la cama actualizada con el nuevo ocupante!");
            
            $$('#estado_cama').html("Estado: Libre");
            $$('#ocupada_por').html("Nombre: -" );
            $$('#fIngreso').html("Fecha de ingreso: -");
            $$('#fPartida').html("Fecha de partida: -");


        })
        .catch(function(error) {

        console.log("Error: " + error);

        });



    });
    
    $$('#popup_buscar').on('click', function(){

        // BUSCAMOS EL ID INGRESADO EN LA BASE DE DATOS
        var buscar_id = $$('#popup_idCliente').val();        
        var docRef = coleccion_registro_pagos.doc(buscar_id);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log('El documento existe!');
                console.log("Document data:", doc.data());

                // AUTOCOMPLETAMOS CON LA INFORMACIÓN DEL CLIENTE ENCONTRADO
                $$('#estadoCama').html("Estado: " + "Ocupada");
                $$('#db_cliente').html("Nombre: " + doc.data().nombre);
                $$('#db_fIngreso').html("Fecha de ingreso: " + doc.data().fechaIngreso);
                $$('#db_fPartida').html("Fecha de partida: " + doc.data().fechaPartida);

                // info del nuevo ocupante guardada en variables
                estado = "Ocupada";
                nombre = doc.data().nombre;
                fIngreso = doc.data().fechaIngreso;
                fPartida = doc.data().fechaPartida;
                estaOcupada = true;

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        
                
    });

    $$('#popup_aceptar').on('click', function(){

        // si la cama es ocupada por un cliente nuevo
        // actualizamos la información de esa cama en la base de datos
        if(estaOcupada == true){

        // hacemos un update en la base de datos
        coleccion_habMatrimonial.doc("1_cm").update
        ({  estado: estado,
            nombre: nombre,
            fIngreso: fIngreso,
            fPartida:fPartida })
        .then(function() {

        console.log("Info de la cama actualizada con el nuevo ocupante!");
            
            $$('#estado_cama').html("Estado: " + estado);
            $$('#ocupada_por').html("Nombre: " + nombre);
            $$('#fIngreso').html("Fecha de ingreso: " + fIngreso);
            $$('#fPartida').html("Fecha de partida: " + fPartida);


        })
        .catch(function(error) {

        console.log("Error: " + error);

        });

        } else {
            
            // no hacer nada
        }

        // volvemos a false la variable estaOcupada
        estaOcupada = false;

        // reiniciamos los datos que se ingresaron buscando al cliente        
            reiniciarDatos();
        

    });

    $$('#btnMP').on('click', function(){

        //verificamos perfil para saber a que menú volver
        if(perfil == "admin"){
            mainView.router.navigate('/menu-admin/');
        } else {
            mainView.router.navigate('/menu-usuario/');
        }

    });

    $$('#popup_cancelar').on('click', function(){
        // reiniciamos los datos de popup
        reiniciarDatos();
    });


    

    



})  

function reiniciarDatos(){
    // reiniciamos los datos de popup
    $$('#popup_idCliente').val("");
    $$('#estadoCama').html("Estado: LIBRE");
    $$('#db_cliente').html("Nombre: -");
    $$('#db_fIngreso').html("Fecha de ingreso: -");
    $$('#db_fPartida').html("Fecha de partida: -");

    
}  



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

  

