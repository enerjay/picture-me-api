var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  facebookId: String,
  images: Array
});

module.exports = mongoose.model('User', userSchema);

