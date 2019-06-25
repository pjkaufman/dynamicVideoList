"use strict";
/**
 * This file has all of the functions that stay the same between the three 
 * different versions of the video player.  
 */
/**
 * Updates the url to point to the rigth directory for the language selected.
 * @param {String} lang is the language to swap the page to.
 * @returns a string which is the url to use as a link to that language for 
 * this page.
 */
Window.Vinya.functions.fixURLForLanguage = function fixURLForLanguage(lang) {
  var url = window.location.href, endpoint = url.substring(url.lastIndexOf('/'));
  url = url.substring(0, url.lastIndexOf('/'));
  url = url.substring(0, url.lastIndexOf('/'));
  url += '/' + lang + endpoint;
  return url;
};

/**
 * Checks to see if the URL contains any parameters.
 * @returns whether or not the url has any url parameters in it.
 */
Window.Vinya.functions.URLContainsParam = function URLContainsParam() {
  for (var key in Window.Vinya.URLParams) {
    if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams[key])) {
      return true;
    }
  }
  return false;
};

/**
 * updates the time in the url.
 */
Window.Vinya.functions.updateURLTime = function updateURLTime() {
  Window.Vinya.player.getCurrentTime().then(function(seconds) {
    Window.Vinya.functions.updateURL(Window.Vinya.URLParams.time, seconds);
  });
};

/**
 * Creates an iframe using the video name and language to select the appropriate link for the Window.Vinya.DOMElements.video.
 * @param {String} videoID is the id of the desired video.
 */
Window.Vinya.functions.createVimeoPlayer = function createVimeoPlayer(videoID) {
  // create iframe
  Window.Vinya.videoOptions.id = videoID;
  Window.Vinya.player = new Vimeo.Player('videosFrames', Window.Vinya.videoOptions);
  Window.Vinya.player.on("timeupdate", Window.Vinya.functions.updateURLTime); // updates the url time when progress is made in the video
  Window.Vinya.player.on("texttrackchange", function (lang) {
    if (!lang.language) {
      // remove the sub from the url
      Window.Vinya.DOMElements.subtitles.value = 'off';
      Window.Vinya.functions.updateURL(Window.Vinya.URLParams.sub, 'off');
    } else {
      Window.Vinya.DOMElements.subtitles.value = lang.language;
      Window.Vinya.functions.updateURL(Window.Vinya.URLParams.sub, lang.language);
    }
  });
  Window.Vinya.player.on("loaded", function () {
    Window.Vinya.DOMElements.video = document.querySelector('iframe');
    Window.Vinya.DOMElements.video.setAttribute('class' , 'resp-iframe');
    Window.Vinya.functions.getTextTracks();         
  });
};

/**
 * Gets the subtitles and captions for the video and then adds them to the
 * select for subtitles. It also selects the subtitle value listed in url 
 * parameter if it exists. 
 */
Window.Vinya.functions.getTextTracks = function getTextTracks() {
  // remove all added tracks
  var elements = document.querySelectorAll('.added');
  for (var i = 0, length =  elements.length; i < length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }
  // add the new ones
  Window.Vinya.player.getTextTracks().then(function(tracks) {
    var subtitle = '';
    var trackSelected = false;
    var lang;
    if (tracks.length !== 0) {
      // append all options to the list
      for (var i = 0, length = tracks.length; i < length; i++) {
        if (tracks[i].kind === 'subtitles') {
          subtitle += '<option value=' + tracks[i].language + ' class="added">' + tracks[i].label + '</option>';
          if (tracks[i].mode === 'showing') {
            lang = tracks[i].language;
            trackSelected = true;
          }
        }
      }
      Window.Vinya.DOMElements.subtitles.innerHTML += subtitle;
      if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.sub)) {
        Window.Vinya.DOMElements.subtitles.value = Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.sub);
      } else if (trackSelected) {
        Window.Vinya.DOMElements.subtitles.value = lang;
        Window.Vinya.functions.updateURL(Window.Vinya.URLParams.sub, lang);
      }
    }
    Window.Vinya.DOMElements.hide('spinner');
    Window.Vinya.DOMElements.display('video');
  });
};