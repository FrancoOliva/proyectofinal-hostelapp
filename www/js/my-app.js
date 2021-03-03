  
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

        { path: '/menu-admin/', url: 'menu-admin.html', },
        { path: '/index/', url: 'index.html', },
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


// Page init correspondiente a la página menu-admin.html
$$(document).on('page:init', '.page[data-name="menu-admin"]', function (e) {
    
    console.log(e);
    alert('menu-admin');
})

// Page init correspondiente a la página index.html
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    
    console.log(e);
    

    $$('#btnAdmin').on('click', function(){
        mainView.router.navigate('/menu-admin/');
    });
})



