angular
  .module('picturemeApp', ['satellizer', 'ui.router', 'ngFileUpload'])
  .constant('API_URL', 'http://localhost:3000')
  .constant('S3_URL', 'https://s3-eu-west-1.amazonaws.com/picture-me/')
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
    .state('index', { 
      url: "", 
      templateUrl: "home.html"  
    })
    .state('home', { 
      url: "/", 
      templateUrl: "home.html" 
    })
    .state('add_photos', {
      url: "/add_photos", 
      templateUrl: "add_photos.html",
      controller: "GridController"
    })
    .state('submit_photos', {
      url: "/submit_photos", 
      templateUrl: "submit_photos.html"
    })
    .state('picture_me', {
      url: "/picture_me",
      templateUrl: "picture_me.html",
      controller: "GridController"
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