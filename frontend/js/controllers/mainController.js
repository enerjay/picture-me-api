angular
  .module('picturemeApp')
  .controller('MainController', MainController);

MainController.$inject = ['$auth', 'Upload', 'API_URL', 'S3_URL', '$rootScope', '$timeout'];
function MainController($auth, Upload, API_URL, S3_URL, $rootScope, $timeout) {

  var self = this;

  self.files = [];
  self.images = ["https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg",
    "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/ee908780-a401-11e5-8788-8d0da8b33d2b.jpg"];

  $rootScope.$on('$stateChangeSuccess', function() {
    $timeout(function() {
      if(!$('.grid').hasClass('initialized')) {
        initializeMasonryGrid();
        $('.grid').addClass('initialized');
      }
    });
  });
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

        // res.data.filenames
        self.images = res.data.filenames.map(function(filename) {
          return S3_URL + filename;
          console.log(images)
        });
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
    { text: "1. A picture of yourself as a child", file: null },
    { text: "2. A picture of your favourite place in the universe", file: null },
    { text: "3. A picture of best friend growing up", file: null },
    { text: "4. A picture of your best friend as an adult", file: null },
    { text: "5. A picture of your life changing event", file: null },
    { text: "6. A picture of your favourite home", file: null },
    { text: "7. A picture of your favourite food", file: null },
    { text: "8. A picture of your favourite sport", file: null },
    { text: "9. A picture of your saddest memory", file: null },
    { text: "10. A picture of your happinest moment", file: null },
    { text: "11. 10 more favourite pictures", file: null },
    { text: "12. A picture of your favourite place in the universe", file: null },
    { text: "13. A picture of best friend growing up", file: null },
    { text: "14. A picture of your best friend as an adult", file: null },
    { text: "15. A picture of your life changing event", file: null },
    { text: "16. A picture of your favourite home", file: null },
    { text: "17. A picture of your favourite food", file: null },
    { text: "18. A picture of your favourite sport", file: null },
    { text: "19. A picture of your saddest memory", file: null },
    { text: "20. A picture of your happinest moment", file: null },
    { text: "21. A picture of your favourite home", file: null },
    { text: "22. A picture of your favourite food", file: null },
    { text: "23. A picture of your favourite sport", file: null },
    { text: "24. A picture of your saddest memory", file: null },
    { text: "25. A picture of your happinest moment", file: null }
   
  ];


}

