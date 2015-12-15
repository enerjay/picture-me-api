angular
  .module('picturemeApp')
  .controller('GridController', GridController);

function GridController() {

  if(!$('.grid').hasClass('initialized')) {
    initializeMasonryGrid();
    $('.grid').addClass('initialized');
  }
  
};