module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: 'mongodb://localhost/pictureme',
  secret: 'iLoveMakingPictures',
  appUrl: 'http://localhost:8000',
  oauth: {
    facebook: {
      accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
      profileUrl: 'https://graph.facebook.com/v2.5/me?fields=id,name,photos'
    }
    
  }
}