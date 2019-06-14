"use strict";
document.addEventListener("DOMContentLoaded", function(){
  var DOMElements = {
    languages: document.getElementById("languages"),
    langBtns: document.querySelectorAll("#swapLanguage > p > a"),
    videoError: document.getElementById('videoError'),
    subtitles: document.getElementById('subtitles'),
    spinner: document.getElementById('loading'),
    video: undefined,
    hide: function (property) {
      DOMElements[property].setAttribute('class', 'hidden');
    },
    display: function (property) {
      DOMElements[property].setAttribute('class', '');
    }
  };
  var videoOptions = {
    id: undefined,
    autoplay: false,
    title: false,
    byline: false
  };
  var player;
  var url = new URL(window.location.href);

  // preprocess check 
  if (URLContainsParam()) {
    // update the video accordingly based on the parameters
    parseURL();
  } else {
    displaySelectedVideo();
  }

  DOMElements.languages.addEventListener("change", function() {
    changeVideo(Window.Vinya.videoTitle, true);
  });

  DOMElements.subtitles.addEventListener("change", function() {
    if (DOMElements.subtitles.value == 'off') {
      player.disableTextTrack();
    } else {
      player.enableTextTrack(DOMElements.subtitles.value);
    }
  });

  // add appropriate url for the language
  for (var i = 0, length = DOMElements.langBtns.length; i < length; i++) {
    DOMElements.langBtns[i].setAttribute("href", fixURLForLanguage(DOMElements.langBtns[i].id));
  }

  /**
   * Displays the video selected by the user.
   */
  function displaySelectedVideo() {
    // display the selected video
    createVimeoPlayer(Window.Vinya.videoTitle, DOMElements.languages.value);
    updateURL(Window.Vinya.URLParams.lang, DOMElements.languages.value);
  }

  /**
   * Updates the url to point to the rigth directory for the language selected.
   * @param {String} lang is the language to swap the page to.
   * @returns a string which is the url to use as a link to that language for 
   * this page.
   */
  function fixURLForLanguage(lang) {
    var url = window.location.href;
    url = url.substring(0, url.lastIndexOf('/'));
    url = url.substring(0, url.lastIndexOf('/'));
    url += '/' + lang + '/videos';
    return url;
  }

  /**
   * Updates the src of the iframe to be that of the desired video if it exists.
   * Otherwise an error message is displayed to the user.
   * @param {String} videoName is the name of the video to display.
   * @param {Boolean} languageChanged is whether or not the language was changed.
   */
  function changeVideo(videoName, languageChanged) {
    if (videoPlayerPreCheck(videoName)) {
      DOMElements.videoError.innerText = ""; 
      updateURL(Window.Vinya.URLParams.lang, DOMElements.languages.value);
      DOMElements.display('spinner');
      player.unload().then(function () {
        videoOptions.id = Window.Vinya[videoName][DOMElements.languages.value];
        player.loadVideo(videoOptions).then( function () {
          player.ready().then(function(){
            if (languageChanged && url.searchParams.has(Window.Vinya.URLParams.time)) {
              player.setCurrentTime(url.searchParams.get(Window.Vinya.URLParams.time));
            }
            getTextTracks(); 
          });
        });
      });
      if (!languageChanged) {
        updateURL(Window.Vinya.URLParams.title, videoName);
      }
    }
  }

  /**
   * Takes a param name and a value and stores that value as the value of the url param.
   * @param {String} param is the param that will added or updated with the val;
   * @param {*} val is the value to put in the url.
   */
  function updateURL(param, val) {
    if (url.searchParams.has(param)) {
      url.searchParams.set(param, val);
    } else {
      url.searchParams.append(param, val);
    }
    // if the subtitles are turned off or the video is changed, remove the sub param
    if (url.searchParams.has(Window.Vinya.URLParams.sub) && val == 'off' ) {
      url.searchParams.delete(Window.Vinya.URLParams.sub);
    }
    // update the browser history
    if (history.pushState) {
      window.history.pushState({path:url.href},'',url.href);
    }
    updateStorage();
  }

  /**
   * Determines which if any of the videos are in the URL and displays
   * content appropriately.
   */
  function parseURL() {
   var params = url.searchParams;
   var lang = params.get(Window.Vinya.URLParams.lang), time = params.get(Window.Vinya.URLParams.time),
      sub = params.get(Window.Vinya.URLParams.sub);
   // check to see if the language is present in the url
   if (params.has(Window.Vinya.URLParams.lang)) {
      DOMElements.languages.value = lang;
    }
    createVimeoPlayer(Window.Vinya.videoTitle, lang);
    // check to see if the time is in the url, if so the video will be set to that time
    if (params.has(Window.Vinya.URLParams.time)) {
      player.setCurrentTime(time);
    }
    if (params.has(Window.Vinya.URLParams.sub)) {
      player.enableTextTrack(sub);
    }
  }

  /**
   * Checks to see if the URL contains any parameters.
   * @returns whether or not the url has any url parameters in it.
   */
  function URLContainsParam() {
    var paramExists = false;
    Object.keys(Window.Vinya.URLParams).forEach(function (key) {
      if (url.searchParams.has(Window.Vinya.URLParams[key])) {
        paramExists = true;
      }
    });
    return paramExists;
  }

  /**
   * Creates an iframe using the video name and language to select the appropriate link for the DOMElements.video.
   * @param {String} videoName is the name of the video to select.
   * @param {String} videoLanguage is the language to get the video in.
   */
  function createVimeoPlayer(videoName, videoLanguage) {
    if (videoPlayerPreCheck(videoName)) {
      // create iframe
      videoOptions.id = Window.Vinya[videoName][videoLanguage];
      player = new Vimeo.Player('videosFrames', videoOptions);
      player.on("timeupdate", updateURLTime); // updates the url time when progress is made in the video
      player.on("texttrackchange", function (lang) {
        if (!lang.language) {
          // remove the sub from the url
          updateURL(Window.Vinya.URLParams.sub, 'off');
          DOMElements.subtitles.value = 'off';
        } else {
          updateURL(Window.Vinya.URLParams.sub, lang.language);
          DOMElements.subtitles.value = lang.language;
        }
      });
      player.on("loaded", function () {
        DOMElements.video = document.querySelector('iframe');
        DOMElements.video.setAttribute('class' , 'resp-iframe');
        getTextTracks();         
      });
    }
  }

  /**
   * updates the time in the url.
   */
  function updateURLTime() {
    player.getCurrentTime().then(function(seconds) {
      updateURL(Window.Vinya.URLParams.time, seconds);
    });
  }
  
  /**
   * Gets the subtitles and captions for the video and then adds them to the
   * select for subtitles. It also selects the subtitle value listed in url 
   * parameter if it exists. 
   */
  function getTextTracks() {
    // remove all added tracks
    var elements = document.querySelectorAll('.added');
    for (var i = 0, length =  elements.length; i < length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
    // add the new ones
    player.getTextTracks().then(function(tracks) {
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
        DOMElements.subtitles.innerHTML += subtitle;
        if (url.searchParams.has(Window.Vinya.URLParams.sub)) {
          DOMElements.subtitles.value = url.searchParams.get(Window.Vinya.URLParams.sub);
        } else if (trackSelected) {
          updateURL(Window.Vinya.URLParams.sub, lang);
          DOMElements.subtitles.value = lang;
        }
      }
      DOMElements.hide('spinner');
    });
  }

  /**
   * Updates the url parameters in storage by removing all unnecesary url params. 
   */
  function updateStorage() {
    // a list of parameters to store in local storage
    var tempURL = new URL(url.href.substring(0, url.href.indexOf('?')));
    if (url.searchParams.has(Window.Vinya.URLParams.sub)) {
      tempURL.searchParams.append(Window.Vinya.URLParams.sub, url.searchParams.get(Window.Vinya.URLParams.sub));
    }
    if (url.searchParams.has(Window.Vinya.URLParams.lang)) {
      tempURL.searchParams.append(Window.Vinya.URLParams.lang, url.searchParams.get(Window.Vinya.URLParams.lang));
    }
    // store the parameters and current url base
    localStorage.setItem('params', tempURL.search);
  }

  /**
   * Determines if it is possible to load the desired video and displays
   * the appropriate response if it is not possible.
   * @returns whether or not the desired video is in the current video list.
   */
  function videoPlayerPreCheck(videoName) {
    if (Window.Vinya[videoName][DOMElements.languages.value] === undefined) {
      DOMElements.videoError.innerText = Window.Vinya.errorMsg;
      if (DOMElements.video != undefined) {
        DOMElements.hide('video');
      }
      DOMElements.hide('spinner');
      return false;
    }
    return true;
  }
});