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
  }, (error) => {
    // handling error response
    // Do Nothing ...
  });

  // Listen for the event.
  document.addEventListener('slidesRetrieved', (e) => {
    const parent = document.getElementsByClassName('slider')[0];
    for (let i = 0; i < 6; i += 1) {
      const slide = document.createElement('li');
      slide.id = `slide-${i+1}`;
      parent.appendChild(slide);

      const newParent = slide;

      const h1 = document.createElement('h1');
      h1.innerHTML = e.slides[i].title;
      newParent.appendChild(h1);

      const img = document.createElement('img');
      img.src = e.slides[i].url;
      newParent.appendChild(img);
    }
  }, false);


})();
// EOF