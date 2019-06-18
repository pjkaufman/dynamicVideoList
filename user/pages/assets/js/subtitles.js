"use strict";
/**
 * Adds event listeners for each of the select options.
 */
Window.Vinya.addEventListeners = function addEventListeners() {
  Window.Vinya.DOMElements.subtitles.addEventListener("change", function() {
    if (Window.Vinya.DOMElements.subtitles.value == 'off') {
      Window.Vinya.player.disableTextTrack();
    } else {
      Window.Vinya.player.enableTextTrack(Window.Vinya.DOMElements.subtitles.value);
    }
  });
}

/**
 * Displays the video selected by the user.
 */
Window.Vinya.displaySelectedVideo = function displaySelectedVideo() {
  // display the selected video
  Window.Vinya.createVimeoPlayer(Window.Vinya.videoLanguage);
}

/**
 * Takes a param name and a value and stores that value as the value of the url param.
 * @param {String} param is the param that will added or updated with the val;
 * @param {*} val is the value to put in the url.
 */
Window.Vinya.updateURL = function updateURL(param, val) {
  console.log(param + ':' + val);
  if (Window.Vinya.url.searchParams.has(param)) {
    Window.Vinya.url.searchParams.set(param, val);
  } else {
    Window.Vinya.url.searchParams.append(param, val);
  }
  // if the subtitles are turned off or the video is changed, remove the sub param
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.sub) && val == 'off' ) {
    Window.Vinya.url.searchParams.delete(Window.Vinya.URLParams.sub);
  } 
  // update the browser history
  if (history.pushState) {
    window.history.pushState({path:Window.Vinya.url.href},'',Window.Vinya.url.href);
  }
  Window.Vinya.updateStorage();
}

/**
 * Determines which if any of the videos are in the URL and displays
 * content appropriately.
 */
Window.Vinya.parseURL = function parseURL() {
  var params = Window.Vinya.url.searchParams;
  var time = params.get(Window.Vinya.URLParams.time), sub = params.get(Window.Vinya.URLParams.sub);
  Window.Vinya.createVimeoPlayer(Window.Vinya.videoLanguage);
  // check to see if the time is in the url, if so the video will be set to that time
  if (params.has(Window.Vinya.URLParams.time)) {
    Window.Vinya.player.setCurrentTime(time);
  }
  if (params.has(Window.Vinya.URLParams.sub)) {
    Window.Vinya.player.enableTextTrack(sub);
  }
}

/**
 * Updates the url parameters in storage by removing all unnecesary url params. 
 */
Window.Vinya.updateStorage = function updateStorage() {
  // a list of parameters to store in local storage
  var tempURL = new URL(Window.Vinya.url.href.substring(0, Window.Vinya.url.href.indexOf('?')));
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.sub)) {
    tempURL.searchParams.append(Window.Vinya.URLParams.sub,Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.sub));
  }
  // store the parameters and current url base
  localStorage.setItem('subParams', tempURL.search);
}

/**
 * Creates an iframe using the video name and language to select the appropriate link for the Window.Vinya.DOMElements.video.
 * @param {String} videoLanguage is the language to get the video in.
 */
Window.Vinya.createVimeoPlayer = function createVimeoPlayer(videoLanguage) {
  // create iframe
  Window.Vinya.videoOptions.id = Window.Vinya.videoID;
  Window.Vinya.player = new Vimeo.Player('videosFrames', Window.Vinya.videoOptions);
  Window.Vinya.player.on("timeupdate", Window.Vinya.updateURLTime); // updates the url time when progress is made in the video
  Window.Vinya.player.on("texttrackchange", function (lang) {
    if (!lang.language) {
      // remove the sub from the url
      Window.Vinya.DOMElements.subtitles.value = 'off';
      Window.Vinya.updateURL(Window.Vinya.URLParams.sub, 'off');
    } else {
      Window.Vinya.DOMElements.subtitles.value = lang.language;
      Window.Vinya.updateURL(Window.Vinya.URLParams.sub, lang.language);
    }
  });
  Window.Vinya.player.on("loaded", function () {
    Window.Vinya.DOMElements.video = document.querySelector('iframe');
    Window.Vinya.DOMElements.video.setAttribute('class' , 'resp-iframe');
    Window.Vinya.getTextTracks();         
  });
}