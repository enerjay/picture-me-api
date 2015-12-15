angular
  .module('picturemeApp')
  .controller('MainController', MainController);

MainController.$inject = ['$auth', 'Upload', 'API_URL'];
function MainController($auth, Upload, API_URL) {

  var self = this;

  self.files = [];

  this.authenticate = function(provider) {
    $auth.authenticate(provider);
  }

  this.file = null;

  this.uploadSingle = function() {
    
    Upload.upload({
      url: API_URL + '/upload/single',
      data: { file: self.file }
    })
    .then(function(res) {
      console.log("Success!");
      console.log(res);
    })
    .catch(function(err) {
      console.log("Error!");
      console.log(err);
    });
  }

  this.uploadMulti = function() {
    self.errorMessage = null;
    self.files = [];

    self.questions.forEach(function(question) {
      if(question.file) { self.files.push(question.file); }
    });

    if(self.files.length === this.questions.length) {
      Upload.upload({
        url: API_URL + '/upload/multi',
        arrayKey: '', // IMPORTANT: without this multer will not accept the files
        data: { files: self.files }
      })
      .then(function(res) {
        console.log("Success!");
        console.log(res);
      })
      .catch(function(err) {
        console.error(err);
      });
    }
    else {
      self.errorMessage = "Please add an image for each question.";
    }
  }
  this.questions = [
    { text: "1. Upload a picture of yourself as a child", file: null },
    { text: "2. Upload a picture of your favourite place in the universe", file: null },
    { text: "3. Upload a picture of best friend growing up", file: null },
    { text: "4. Upload a picture of your best friend as an adult", file: null },
    { text: "5. Upload a picture of your life changing event", file: null },
    { text: "6. Upload a picture of your favourite home", file: null },
    { text: "7. Upload a picture of your favourite food", file: null },
    { text: "8. Upload a picture of your favourite sport", file: null },
    { text: "9. Upload a picture of your saddest memory", file: null },
    { text: "10. Upload a picture of your happinest moment", file: null },
    { text: "11. Upload a 10 more pictures", file: null }
  ];


}

