var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  facebookId: String,
});

module.exports = mongoose.model('User', userSchema);
Status API Training Shop Blog About Pricing