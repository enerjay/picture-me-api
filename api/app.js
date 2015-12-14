var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var request = require('request-promise');
var qs = require('qs');
var app = express();
var config = require('./config');
var User = require('./models/user');

mongoose.connect(config.databaseUrl);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: config.appUrl,
  credentials: true
}));


app.post('/auth/facebook', function(req, res) {
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_API_SECRET,
    redirect_uri: config.appUrl + "/",
    scope: 'user_birthday'
  };
  request.get({ url: config.oauth.facebook.accessTokenUrl, qs: params, json: true })
    .then(function(accessToken) {
      return request.get({ url: config.oauth.facebook.profileUrl, qs: accessToken, json: true });
    })
    .then(function(profile) {
      return User.findOne({ email: profile.email })
        .then(function(user) {
          if(user) {
            user.facebookId = profile.id;
            user.picture = user.picture || profile.picture.data.url;
          }
          else {
            user = new User({
              facebookId: profile.id,
              name: profile.name,
              picture: profile.picture.data.url,
              email: profile.email
            });
          }
          
          return user.save();
        })
      })
      .then(function(user) {
        var token = jwt.sign(user, config.secret, { expiresIn: '24h' });
        return res.send({ token: token });
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({ error: err });
      });
});


app.listen(config.port);
console.log("Express is listening on port " + config.port);