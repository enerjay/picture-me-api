function initializeMasonryGrid() {
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 100
  });
  $('.img-zoom').hover(function() {
          $(this).addClass('transition');
   
      }, function() {
          $(this).removeClass('transition');
      });  
};

