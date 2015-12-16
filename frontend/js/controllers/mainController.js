angular
  .module('picturemeApp')
  .controller('MainController', MainController);

MainController.$inject = ['$auth', 'Upload', 'API_URL', 'S3_URL', '$rootScope', '$timeout'];
function MainController($auth, Upload, API_URL, S3_URL, $rootScope, $timeout) {

  var self = this;

  self.files = [];
  self.images = ["https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daac4d00-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daac7410-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daadac90-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daae48d0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daaebe00-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daafcf70-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab0b9d0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab1f250-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab3c710-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab4d880-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab54db0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab5e9f0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab6fb60-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dab8a910-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/daba2fb0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dabb4120-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dabc2b80-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dabceed0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dabe0040-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dabf86e0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dac10d80-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dac2bb30-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dac468e0-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dac57a50-a41d-11e5-9937-bbc0268b34a4.jpg", "https://s3-eu-west-1.amazonaws.com/picture-me/uploads/dac68bc0-a41d-11e5-9937-bbc0268b34a4.jpg"];

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
        });
        console.log(self.images);
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

