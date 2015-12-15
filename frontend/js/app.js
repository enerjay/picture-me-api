angular
  .module('picturemeApp', ['satellizer', 'ui.router'])
  .constant('API_URL', 'http://localhost:3000')
  .config(oauthConfig)
  .config(MainRouter);


oauthConfig.$inject = ['API_URL', '$authProvider'];
function oauthConfig(API_URL, $authProvider) {
  $authProvider.facebook({
    url: API_URL + '/auth/facebook',
    clientId: '1535623983421042'
  });
}

function MainRouter($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('index', { //'home is a name ---so we canrefer to this stste later
      url: "", // a relative url -- so angular can match the route to this state. 
      templateUrl: "home.html" // the name of the file that contains our html for this state (a template)
    })
    .state('home', { //'home is a name ---so we canrefer to this stste later
      url: "/", // a relative url -- so angular can match the route to this state. 
      templateUrl: "home.html" // the name of the file that contains our html for this state (a template)
    })
    .state('add_photos', {
      url: "/add_photos", 
      templateUrl: "add_photos.html"
    })
    .state('submit_photos', {
      url: "/submit_photos", 
      templateUrl: "submit_photos.html"
    })
    .state('picture_me', {
      url: "/picture_me",
      templateUrl: "picture_me.html"
    })
    .state('share', {
      url: "/share", 
      templateUrl: "share.html"
    })
    .state('about', {
      url: "/about", 
      templateUrl: "about.html"
    });

  $urlRouterProvider.otherwise("/");
}