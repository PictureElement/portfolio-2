// Author: PictureElement (Marios Sofokleous)
// Description: Avoid costly scroll andlers and lazy load images using
// Intersection Observer.
// Date: 23.02.17

// ------------------------------ HELPER FUNCTION ------------------------------

// Load image
function applyImage (image, source) {
  // Prevent this from being lazy loaded a second time
  image.classList.add('js-lazy-load--handled');
  // Load image
  image.src = source;
  // Fade-in image load
  image.classList.add('fade-in');
}

// Preload image in browser's cache
function preloadImage (image) {
  // Get url from data-src attribute
  var url = image.dataset.src;
  if (!url) {
    return;
  }
  // Built-in image object
  var img = new Image();
  // Preload image
  img.src = url;
  // Apply image
  applyImage(image, url);
}

// Intersection observer's callback
function callback (entries, observer) {
  // Disconnect if we've already loaded all of the images
  if (imageCount === 0) {
    observer.disconnect();
  }
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0) {
       imageCount--;
      // Stop observing target
      observer.unobserve(entry.target);
      // Preload target in browser's cache
      preloadImage(entry.target);
    }
  })
}

// Load images immediately if intersection observer is not supported by the
// browser
function loadImagesImmediately (images) {
  images.forEach(function (image) {
    preloadImage(image);
  });
}

// --------------------------------- MAIN LOGIC --------------------------------

// Return a list of all elements within the document with the specified class
var images = document.querySelectorAll('.js-lazy-load');
// Need this in order to disconnect the observer when all images are loaded
var imageCount = images.length;

// If the browser supports IntersectionObserver
if ('IntersectionObserver' in window) {
  // Options
  var options = {
    // Grow each side of the root element's (viewport) bounding box. For
    // example, the target will be downloaded once intersects the area above or
    // below the viewport
    rootMargin: '100px 0px',
    // A threshold of 1.0 means that when 100% of the target is visible within
    // the element specified by the root option (if the root is not specified it
    // defaults to the browser viewport), the callback is invoked.
    threshold: 0.01
  }

  // Create an intersection observer
  var io = new IntersectionObserver(callback, options);

  // Start observing the images
  images.forEach(function (image) {
    // Do not observe images that have been loaded
    if (image.classList.contains('js-lazy-load--handled')) {
      return;
    }
    // Observe image
    io.observe(image);
  });
} else {
  loadImagesImmediately(images);
}
