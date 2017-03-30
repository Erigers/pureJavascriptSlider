/**
 * Steps'n'Notes
 * 1. HTTP GET Data for slider from JSONPlaceholder
 * 2. Create Listener for better organisation when the response is retrieved
 */

(() => {
  // DOM ready
  // reusable GET request
  httpGet = (url, cb) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        cb(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
  };

  // step 1
  httpGet('https://jsonplaceholder.typicode.com/photos', (response) => {
    const event = new Event('slidesRetrieved');
    event.slides = JSON.parse(response);
    // Dispatch the event.
    document.dispatchEvent(event);
  });

  manageActive = () => {
    const el = document.getElementsByClassName('active')[0];
    const el2 = document.getElementsByClassName('thumbnailActive')[0];
    const className = 'active';
    const className2 = 'thumbnailActive';

    if (el.classList) {
      el.classList.remove(className);
      el2.classList.remove(className2);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      el2.className = el2.className.replace(new RegExp('(^|\\b)' + className2.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const nextSlide = document.getElementById(`slide-${current + 1}`);
    nextSlide.className = 'active';
    const nextThumb = document.getElementById(`thumb-${current + 1}`);
    nextThumb.className += ' thumbnailActive';
  };

  nextImage = () => {
    if (nrSlides === current + 1) {
      current = 0;
    } else {
      current++;
    }
    manageActive();
  };

  prevImage = () => {
    if (current === 0) {
      current = nrSlides -1;
    } else {
      current--;
    }
    manageActive();
  };
  autoSlide = () => {
    sliderTimeout = setInterval(function () {
      nextImage();
      manageActive();
    }, slideTimer);
    window.clearInterval(0) ;
  };

  goToSlide = slideNr => {
    current = slideNr;
    manageActive();

  };
  //Configurable options
  let nrSlides = 8; //number of slides
  const showFirst = 0;
  const slideTimer = 3000;

  let current = showFirst;
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  // Listen for the event.
  document.addEventListener('slidesRetrieved', (e) => {
    const parent = document.getElementsByClassName('slider')[0];
    const thumbParent = document.getElementById('thumbs');

    for (let i = 0; i < nrSlides; i += 1) {
      const slide = document.createElement('li');
      slide.id = `slide-${i + 1}`;

      if (i === showFirst) {
        slide.className = 'active';
      }
      parent.appendChild(slide);

      //Generate new slide
      const newParent = slide;

      //Generate h1 tag
      const h1 = document.createElement('h1');
      h1.innerHTML = e.slides[i].title;
      newParent.appendChild(h1);

      const img = document.createElement('img');
      img.src = e.slides[i].url;
      img.className += 'image';
      newParent.appendChild(img);

      const thumb = document.createElement('img');
      thumb.id = `thumb-${i + 1}`;
      thumb.src = e.slides[i].thumbnailUrl;
      thumb.className += 'thumbnail';
      if (i === showFirst) {
        thumb.className += ' thumbnailActive';
      }
      thumbParent.appendChild(thumb);

    }

  }, false);

  next.addEventListener('click',nextImage);
  prev.addEventListener('click',prevImage);

  //Change page when a thumnail is clicked
  let imgs = document.getElementById('thumbs');
  imgs.addEventListener('click', function (e) {
    let firstsplit = e.target.getAttribute('id');
    let fullsplit = firstsplit.split('-')[1];
    let x = parseInt(fullsplit);
    goToSlide(x-1)
  });

  document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
      case 37: // left
        prevImage();
        break;

      case 39: // right
        nextImage();
        break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  };
  autoSlide();
})();
// EOF