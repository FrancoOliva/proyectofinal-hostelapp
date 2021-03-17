  
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
        { path: '/registrar-pago/', url: 'registrar-pago.html', },
        { path: '/registrar-gasto/', url: 'registrar-gasto.html', }, 
        { path: '/buscar-cliente/', url: 'buscar-cliente.html', }
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// inicializar base de datos
db = firebase.firestore();

// referencia a la colección usuarios en nuestra DB
coleccion_usuarios = db.collection('usuarios');
coleccion_clientes = db.collection('clientes');
//coleccion_hp5 = db.collection('habitacionPara5personas');
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




// page-init para copiar y pegar en caso de nuevas páginas
// $$(document).on('page:init', '.page[data-name="registrar-gasto"]', function (e) {   console.log(e);  })

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
        
        // guardamos el día actual en una variable
        var hoy = new Date();
        var dia = hoy.getDate();
        var mes = hoy.getMonth() + 1;
        var año = hoy.getFullYear();

        if(dia < 10){
            dia = '0' + dia;
        }

        if(mes < 10){
            mes = '0' + mes;
        }

        var reporteHoy = año + "-" + mes + "-" + dia;        
        console.log(reporteHoy);
        
        // acumulamos los clientes nuevos en una variable
        var clientesNuevos = 0;
        
        
        // recuperamos de la db a los clientes registrados en el día
        db.collection("clientes").where("fRegistro", "==", reporteHoy)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                clientesNuevos++;
            });

            if(clientesNuevos == 0){
                console.log("No hay clientes nuevos");
                $$('#clientesNuevos').text("Clientes nuevos: 0");
            } else {
                console.log("Clientes nuevos: " + clientesNuevos);
                $$('#clientesNuevos').text("Clientes nuevos: " + clientesNuevos);
            }


        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        // acumulamos en una variable los pagos en efectivo
        var pagosEnEfectivo = 0;
        var pagosConTarjeta = 0;

        // recuperamos los pagos que se hicieron en el día
        db.collection("registro_pagos").where("fechaIngreso", "==", reporteHoy)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                console.log(doc.data().importe, " ", doc.data().formaDePago, " ", doc.data().nombre);
                
                // filtramos los pagos en efectivo o en tarjeta para que se sumen
                // en sus variables de forma correcta
                if(doc.data().formaDePago == "efectivo"){
                    pagosEnEfectivo += parseInt(doc.data().importe);
                } else {
                    pagosConTarjeta += parseInt(doc.data().importe);
                }

                

            });

                // si las variables que contienen los pagos en efectivo o tarjeta siguen en 0
                // modificamos a un valor por defecto, caso contrario, mostramos la información correspondiente
                if(pagosEnEfectivo == 0){
                console.log("No se registraron pagos en efectivo");
                $$('#pagosEnEfectivo').text("Pagos en efectivo: No hay pagos.");
                } else {
                    
                    
                    console.log("Efectivo en el día: " + pagosEnEfectivo);
                    $$('#pagosEnEfectivo').text("Pagos en efectivo: "+ pagosEnEfectivo);
                }

                if(pagosConTarjeta == 0){
                console.log("No se registraron pagos con tarjetas");
                $$('#pagosConTarjeta').text("Pagos con tarjeta: No hay pagos.");
                } else {
                    
                    
                    console.log("Pagos con tarjeta: " + pagosConTarjeta);
                    $$('#pagosConTarjeta').text("Pagos con tarjeta: "+ pagosConTarjeta);
                }

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        
        // recuperamos los gastos que se hicieron en el día de la base de datos
        // y los guardamos en una variable
        var gastos = 0;


        db.collection("registro_gastos").where("fecha", "==", reporteHoy)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                gastos += parseInt(doc.data().importe);
                console.log("Gastos del día: " + doc.data().importe);
            });

            if(gastos == 0){
                $$('#gastos').text("Gastos: No hay gastos.");
            } else {
                $$('#gastos').text("Gastos: " + gastos);
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        
    
    

   
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
        mainView.router.navigate('/buscar-cliente/');
    });

    $$('#btnAdminRegistrarPago').on('click', function(){
        console.log("Selección: Registrar un pago!");
        mainView.router.navigate('/registrar-pago/');
    });

    $$('#btnAdminRegistrarGasto').on('click', function(){
        console.log("Selección: Registrar un gasto!");
        mainView.router.navigate('/registrar-gasto/');
    });

    

    $$('#btnAdminCerrarSesion').on('click', function(){

        firebase.auth().signOut().then(() => {
          // Sign-out successful.
            console.log('Cerrar sesión ok!');

            perfil = "";
            texto1 = "";
            texto2 = "";
            btn1 = "";
            btn2 = "";
            ruta1 = "";
            ruta2 = "";
            id_cama = "";

            mainView.router.navigate('/index/');
        }).catch((error) => {
          // An error happened.
        });
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

    $$('#registrarGastoUsuario').on('click', function(){
        mainView.router.navigate('/registrar-gasto/');
    });

    $$('#btnCerrarSesion').on('click', function(){

        firebase.auth().signOut().then(() => {
          // Sign-out successful.
            console.log('Cerrar sesión ok!');
            mainView.router.navigate('/index/');
        }).catch((error) => {
          // An error happened.
        });
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

    $$('#btnAdminVolver').on('click', function(){
        mainView.router.navigate('/menu-admin/');
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

    $$('#btnVolver').on('click', function(){
        if (perfil == "admin"){
            mainView.router.navigate('/menu-admin/');
        } else {
            mainView.router.navigate('/menu-usuario/');
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

    // CAPTURAMOS EL ID DE LA CAMA SELECCIONADA
    var idCamaSeleccionada = "";
    var estado = "";
    var nombre = "";
    var apellido = "";
    var fIngreso = "";
    var fPartida = "";
    var estaOcupada = false;

    

    //RECORREMOS CAMAS DE UNA COLECCIÓN PARA OBTENER SUS DATOS
    db.collection("habitacionPara5personas").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                
                console.log(doc.id, " => ", doc.data());    
                
                
                estadoCama = doc.data().estado;

                $$('#listaCamas_hp5').append(

                "<!-- CAMA "+doc.id+" -->" +
                '<li class="accordion-item">' +
                '<a class="item-content item-link" href="#">' +
                '<div class="item-inner">' +
                '<div class="item-title camaSeleccionada" id="'+doc.id+'"'+'>Cama '+doc.id+'</div>' +
                '</div>' +
                '</a>' +
                        
                '<div class="accordion-item-content">' +
                '<div class="block">' +

                '<p id="estado'+doc.id+'">Estado: '+doc.data().estado+'</p>' +                 
                            
                '<p id="nombre'+doc.id+'">Nombre: '+doc.data().nombreCliente+'</p>' +
                '<p id="apellido'+doc.id+'">Apellido: '+doc.data().apellidoCliente+'</p>' +
                '<p id="ingreso'+doc.id+'">Fecha de ingreso: '+doc.data().ingresoCliente+'</p>' +                   
                '<p id="partida'+doc.id+'">Fecha de partida: '+doc.data().partidaCliente+'</p>' +
                            

                '<div class="row">' +
                '<button class="col-50 button button-outline button-round popup-open modificar" data-popup=".popup-about">Modificar</button>' +
                '<button class="col-50 button button-outline button-round" id="btnLiberarCama">Liberar Cama</button>' +
                '</div>' +

                '</div>' +
                '</div>' +

                '</li>'
                    );
           
            }); // cierra el .then

            // CAPTURAMOS ID CAMA SELECCIONADA
            $$('.camaSeleccionada').on('click', function(id){  // CONTINUAR
                idCamaSeleccionada = this.id;
                console.log(idCamaSeleccionada);
            });

            // BUSCAMOS ID del nuevo ocupante en la base de datos
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
                            $$('#db_apellido').html("Apellido: " + doc.data().apellido);
                            $$('#db_fIngreso').html("Fecha de ingreso: " + doc.data().fechaIngreso);
                            $$('#db_fPartida').html("Fecha de partida: " + doc.data().fechaPartida);

                            // info del nuevo ocupante guardada en variables
                            estado = "Ocupada";
                            nombre = doc.data().nombre;
                            apellido = doc.data().apellido;
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

            // MODIFICAMOS INFORMACIÓN DE LA CAMA EN LA BASE DE DATOS CON EL NUEVO OCUPANTE
            $$('#popup_aceptar').on('click', function(){

            // si la cama es ocupada por un cliente nuevo
            // actualizamos la información de esa cama en la base de datos
            if(estaOcupada == true){

            // hacemos un update en la base de datos
            db.collection('habitacionPara5personas').doc(idCamaSeleccionada).update
            ({  estado: estado,
                nombreCliente: nombre,
                apellidoCliente: apellido,
                ingresoCliente: fIngreso,
                partidaCliente:fPartida })
            .then(function() {

            console.log("Info de la cama actualizada con el nuevo ocupante!");
            // actualizamos la vista de la cama seleccionada
            // mostrando la información del nuevo ocupante que completamos en el popup
            $$('#estado'+idCamaSeleccionada).html("Estado: "+ estado);
            $$('#nombre'+idCamaSeleccionada).html("Nombre: "+ nombre);
            $$('#apellido'+idCamaSeleccionada).html("Apellido: "+ apellido);
            $$('#ingreso'+idCamaSeleccionada).html("Fecha de ingreso: "+ fIngreso);
            $$('#partida'+idCamaSeleccionada).html("Fecha de partida: "+ fPartida);


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

        // Actualizamos a datos por defecto porque no hay ocupantes
        $$('#btnLiberarCama').on('click', function(){

        // si no hay ocupantes, reiniciamos la información de la cama
        // en la base de datos y en la página
        db.collection('habitacionPara5personas').doc(idCamaSeleccionada).update
        ({  estado: "Libre",
            nombreCliente: "-",
            ingresoCliente: "-",
            partidaCliente:"-" })
        .then(function() {

        console.log("Datos actualizados en la DB: cama libre, no hay ocupantes.");
            
            $$('#estado'+idCamaSeleccionada).html("Estado: Libre");
            $$('#nombre'+idCamaSeleccionada).html("Nombre: -" );
            $$('#ingreso'+idCamaSeleccionada).html("Fecha de ingreso: -");
            $$('#partida'+idCamaSeleccionada).html("Fecha de partida: -");


        })
        .catch(function(error) {

        console.log("Error: " + error);

        });



    });



    }); // termina   
    
    // volvemos al menú principal del usuario
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

function capturarIDcama(id){
    console.log(id);
}

// este popup permite editar la información del ocupante de una cama
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

    // busca el ID en la base de datos clientes
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

    // si los datos son correctos guardamos la información en la base de datos
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


    // volvemos a un menú dependiendo el perfil
    $$('#rp_volver').on('click', function(){
        
        console.log('Volver al menú!');
        if(perfil == "admin"){
            mainView.router.navigate('/menu-admin/');
        } else {
            mainView.router.navigate('/menu-usuario/');
        }
    });

}) 

  
$$(document).on('page:init', '.page[data-name="registrar-gasto"]', function (e) {

        console.log("Página registrar-pago cargada!");

        // volver al menú
        $$('#rg_Volver').on('click', function(){
            if(perfil == "admin"){
                mainView.router.navigate('/menu-admin/');
            } else {
                mainView.router.navigate('/menu-usuario/');
            }
        });

        $$('#rg_Aceptar').on('click', function(){
            
            nombre      = $$('#rg_nombre').val();
            motivo      = $$('#rg_motivo').val();
            importe     = $$('#rg_importe').val();
            fecha       = $$('#rg_fecha').val();
            
            // creamos un objeto JSON con la información del gasto realizado
            var data = {
                nombre: nombre,
                motivo: motivo,
                importe: importe,
                fecha: fecha
            };

            // Añadimos el objeto JSON a la colección registro_gastos en la base de datos
            db.collection("registro_gastos").add(data)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                console.log("Documento agregado a la base de datos");


            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            // mensajes correspondientes a la página /avisos-usuario/
                texto1 = "Gasto registrado";
                texto2 = "Los datos del gasto fueron guardados correctamente.";
                btn1 = "Registrar gasto";
                btn2 = "Menú Principal";
                
                if (perfil == "admin"){
                    ruta1 = '/registrar-gasto/';
                    ruta2 = '/menu-admin/';
                } else {
                    ruta1 = '/registrar-gasto/';
                    ruta2 = '/menu-usuario/';
                }
                
                mainView.router.navigate('/avisos-usuario/');
            
            
            
        });
})


$$(document).on('page:init', '.page[data-name="buscar-cliente"]', function (e) {
   console.log(e);
   console.log("Página buscar-cliente cargada!");


   // OBTENEMOS TODOS LOS DOCUMENTOS DE LA COLECCIÓN habitacionPara5Personas
   // para saber en qué cama esta el cliente que buscamos
   db.collection("habitacionPara5personas").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            
            console.log(doc.id, " => ", doc.data());

            if(doc.data().estado == "Libre" || doc.data().estado == "libre"){
                $$('#ingresarContenido').append(

                    '<li class="accordion-item"><a class="item-content item-link" href="#">' +
                    '<div class="item-inner">' +
                    '<div class="item-title">Cama ' + doc.id + ' Libre</div>' +
                    '</div>' +
                    '</a>' +
                    '<div class="accordion-item-content">' +
                    '<div class="block">' +
                    '<p>Esta cama no se encuentra ocupada por ningún cliente y pertenece a la habitación para 5 personas.</p>' +
                    
                    '</div>' +
                    '</div>' +
                    '</li>' 
                );
            } else {
                // agregamos html con los datos encontrados en la colección
            $$('#ingresarContenido').append(

                    '<li class="accordion-item"><a class="item-content item-link" href="#">' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + doc.data().nombreCliente +" "+doc.data().apellidoCliente+ '</div>' +
                    '</div>' +
                    '</a>' +
                    '<div class="accordion-item-content">' +
                    '<div class="block">' +
                    '<p>El cliente se encuentra en la habitación para 5 personas, cama '+ doc.id +'.</p>' +
                    '<p>Fecha de ingreso: '+doc.data().ingresoCliente + '</p>' +
                    '<p>Fecha de partida: '+doc.data().partidaCliente +'</p>' +
                    '</div>' +
                    '</div>' +
                    '</li>' 
                );
            }

             
        });

        // código para que el searchbar funcione
        // busca en la lista que creamos datos que coincidan con lo que buscamos
        var searchbar = app.searchbar.create({
            el: '.searchbar',
            searchContainer: '.list',
            searchIn: '.item-title',
            on: {
              search(sb, query, previousQuery) {
                console.log(query, previousQuery);
              }
            }
          });   

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    

    

})