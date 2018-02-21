// Target images
var images = document.querySelectorAll('.js-lazy-load');

// Options
var options = {
  rootMargin: '50px 0px',
  threshold: 0.01
}

// Create an intersection observer
var io = new IntersectionObserver(callback, options);

// Start observing the images
images.forEach(function(image) {
  io.observe(image);
});

// Callback
function callback(entries, observer) {
  entries.forEach(function(entry) {
    if(entry.intersectionRatio > 0) {
      observer.unobserve(entry.target);
      loadImage(entry.target);
    }
  })
}

function loadImage(image) {
  // Get data-src attribute
  var src = image.dataset.src;
  // fetch image
  fetch(src).then(function(response) {
    // Prevent image from being lazy loaded a second time 
    image.classList.add('js-lazy-load--handled');
    // Set src attribute
    image.src = src;
  })
}