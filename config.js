module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGOLAB_URI || 'mongodb://localhost/pictureme',
  secret: 'iLoveMakingPictures',
  appUrl: 'http://jhepburn-zikalala.com',
  oauth: {
    facebook: {
      accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
      profileUrl: 'https://graph.facebook.com/v2.5/me?fields=id,name,picture.width(500).height(500),birthday'
    }
    
  }
}