angular
  .module('picturemeApp', ['satellizer'])
  .constant('API_URL', 'http://localhost:3000')
  .config(oauthConfig);

oauthConfig.$inject = ['API_URL', '$authProvider', 'facebookClientId'];
function oauthConfig(API_URL, $authProvider, facebookClientId) {
  $authProvider.facebook({
    url: API_URL + '/auth/facebook',
    clientId: facebookClientId
  });
}