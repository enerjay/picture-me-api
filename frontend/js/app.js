angular
  .module('picturemeApp', ['satellizer'])
  .constant('API_URL', 'http://localhost:3000')
  .config(oauthConfig);

oauthConfig.$inject = ['API_URL', '$authProvider'];
function oauthConfig(API_URL, $authProvider) {
  $authProvider.facebook({
    url: API_URL + '/auth/facebook',
    clientId: '1535623983421042'
  });
}