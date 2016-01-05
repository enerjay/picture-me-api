var express = require('express');
var multer = require('multer');
var s3 = require('multer-s3');
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
var uuid = require('uuid');
var expressJWT = require('express-jwt');

mongoose.connect(config.databaseUrl);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: config.appUrl,
  credentials: true
}));

app.use('/', expressJWT({ secret: config.secret })
  .unless({ path: '/auth/facebook', method: 'post' }));

app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(401).json({ message: "Invalid token" });
  }
  next();
});

var upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: 'picture-me',
    secretAccessKey: process.env.AWS_PICTUREME_SECRET,
    accessKeyId: process.env.AWS_PICTUREME_KEY,
    region: 'eu-west-1',
    contentType: function(req, file, next) {
      next(null, file.mimetype);
    },
    filename: function(req, file, next) {
      var ext = '.' + file.originalname.split('.').splice(-1)[0];
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

app.get('/user', function(req, res) {
  console.log(req.user);
  // TODO: handle non-logged-in user
  User.findOne({ _id: req.user._id }, function(err, user) {
    if(err) return res.status(404).json({ message: "Could not find user!" });
    res.status(200).json({ user: user });
  });
});

app.delete('/user', function(req, res) {
  console.log(req.user);

  if(req.user) {
    User.remove({ _id: req.user._id }, function(err) {
      if(err) return res.status(500).json({ message: "Could not delete user!" });
      res.status(204).send();
    });
  }
  else {
    return res.status(401).json({ message: "You must be logged in to perform this action" });
  }
});

app.delete('/user/pictures', function(req, res) {
  if(req.user) {
    User.update({ _id: req.user._id }, { $set: { images: [] } }, { new: true }, function(err, user) {
      if(err) return res.status(500).json({ message: "Could not delete user images!" });
      res.status(200).json({ user: user });
    });
  }
  else {
    return res.status(401).json({ message: "You must be logged in to perform this action" });
  }
});

// app.post('/upload/single', upload.single('file'), function(req, res) {
//   res.status(200).json({ filename: req.file.key });
// });

app.post('/upload/face', upload.single('file'), function(req, res) {

    User.findOne({ _id: req.user._id }, function(err, user) {
      if(err || !user) return res.status(404).json({ message: "Could not find user!" });
      user.picture = 'https://s3-eu-west-1.amazonaws.com/picture-me/' + req.file.key;

      user.save(function(err, user) {
        if(err) return res.status(500).json({ message: "Error saving user!" });
        res.status(200).json({ picture: user.picture });
      });
    });
});

app.post('/upload/multi', upload.array('files'), function(req, res) {
  filenames = Object.keys(req.files).map(function(key) {
    return 'https://s3-eu-west-1.amazonaws.com/picture-me/' + req.files[key].key;
  });

  User.findOne({ _id: req.user._id }, function(err, user) {
    if(err || !user) return res.status(404).json({ message: "Could not find user!" });
    user.images = filenames;

    user.save(function(err, user) {
      if(err) return res.status(500).json({ message: "Error saving user!" });
      res.status(200).json({ filenames: filenames });
    });
  });
});

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
      return User.findOne({ facebookId: profile.id })
        .then(function(user) {
          if(user) {
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