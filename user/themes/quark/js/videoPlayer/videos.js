/**
 * Adds event listeners for each of the select options.
 */
Window.Vinya.functions.addEventListeners = function addEventListeners() {
  Window.Vinya.DOMElements.languages.addEventListener("change", function() {
    Window.Vinya.functions.fixBtnDisplay(Window.Vinya.DOMElements.videoList.value);
    if (Window.Vinya.player != undefined) {
      Window.Vinya.functions.changeVideo(Window.Vinya.DOMElements.videoList.value, true);
    } else {
      Window.Vinya.functions.createVimeoPlayer();
    } 
  });

  Window.Vinya.DOMElements.videoList.addEventListener("change", function () {
    Window.Vinya.functions.displaySelectedVideo();
  });
  Window.Vinya.DOMElements.subtitles.addEventListener("change", function() {
    if (Window.Vinya.DOMElements.subtitles.value == 'off') {
      Window.Vinya.player.disableTextTrack();
    } else {
      Window.Vinya.player.enableTextTrack(Window.Vinya.DOMElements.subtitles.value);
    }
  });
  Window.Vinya.DOMElements.nextEpisode.addEventListener("click", function() {
    var title = Window.Vinya.DOMElements.videoList.value;
    var episodeNum = parseInt(title.replace( /^\D+/g, ''));
    var epsiodeFormat = title.replace(episodeNum, '');
    var next = episodeNum + 1;
    Window.Vinya.DOMElements.videoList.value = epsiodeFormat + next;
    Window.Vinya.DOMElements.videoTitle.innerText = Window.Vinya.videoList[epsiodeFormat + next].title;
    Window.Vinya.functions.fixBtnDisplay(epsiodeFormat + next);
    Window.Vinya.functions.changeVideo(epsiodeFormat + next, false);
  });
  Window.Vinya.DOMElements.backEpisode.addEventListener("click", function() {
    var title = Window.Vinya.DOMElements.videoList.value;
    var episodeNum = parseInt(title.replace( /^\D+/g, ''));
    var epsiodeFormat = title.replace(episodeNum, '');
    var  back = episodeNum - 1;
    Window.Vinya.DOMElements.videoList.value = epsiodeFormat + back;
    Window.Vinya.DOMElements.videoTitle.innerText = Window.Vinya.videoList[epsiodeFormat + back].title;
    Window.Vinya.functions.fixBtnDisplay(epsiodeFormat + back);
    Window.Vinya.functions.changeVideo(epsiodeFormat + back, false);
  });
};

/**
 * Makes sure that the buttons are currently setup correctly
 * @param {String} episode is the name of the currently selected episode.
 */
Window.Vinya.functions.fixBtnDisplay = function fixBtnDisplay(episode) {
  var lang = Window.Vinya.DOMElements.languages.value;
  if (Window.Vinya.videoList[episode][lang]) {
    // fix the title
    Window.Vinya.DOMElements.videoTitle.innerText = Window.Vinya.videoList[episode].title;
    // extract a number from the current episode name
    var episodeNum = parseInt(episode.replace( /^\D+/g, ''));
    var epsiodeFormat = episode.replace(episodeNum, '');
    var next = episodeNum + 1, back = episodeNum - 1;
    // hide or display the back and forward buttons
    if (Window.Vinya.videoList[epsiodeFormat + next] != undefined && Window.Vinya.videoList[epsiodeFormat + next][lang] != undefined ) {
      Window.Vinya.DOMElements.display('nextEpisode');
    } else {
      Window.Vinya.DOMElements.hide('nextEpisode');
    }
    if (Window.Vinya.videoList[epsiodeFormat + back] != undefined && Window.Vinya.videoList[epsiodeFormat + back][lang] != undefined) {
      Window.Vinya.DOMElements.display('backEpisode');
    } else {
      Window.Vinya.DOMElements.hide('backEpisode');
    }
  } else {
    // hide everything
    Window.Vinya.DOMElements.hide('nextEpisode');
    Window.Vinya.DOMElements.hide('backEpisode');
    Window.Vinya.DOMElements.videoTitle.innerText = '';
  }
};

/**
 * Displays the video selected by the user.
 */
Window.Vinya.functions.displaySelectedVideo = function displaySelectedVideo() {
  var title = Window.Vinya.DOMElements.videoList.value, lang = Window.Vinya.DOMElements.languages.value;
  Window.Vinya.functions.fixBtnDisplay(title);
  // display the selected video
  if (Window.Vinya.player === undefined ) {
    if (Window.Vinya.functions.videoPlayerPreCheck(title)) {
      Window.Vinya.functions.createVimeoPlayer(Window.Vinya.videoList[title][lang]);
      Window.Vinya.functions.updateURL(Window.Vinya.URLParams.title, title);
      Window.Vinya.functions.updateURL(Window.Vinya.URLParams.lang, lang);
    }
  } else {
    Window.Vinya.functions.changeVideo(title, false);
  }
};

/**
 * Updates the src of the iframe to be that of the desired video if it exists.
 * Otherwise an error message is displayed to the user.
 * @param {String} videoName is the name of the video to display.
 * @param {Boolean} languageChanged is whether or not the language was changed.
 */
Window.Vinya.functions.changeVideo = function changeVideo(videoName, languageChanged) {
  if (Window.Vinya.functions.videoPlayerPreCheck(videoName)) {
    Window.Vinya.DOMElements.videoError.innerText = ""; 
    Window.Vinya.functions.updateURL(Window.Vinya.URLParams.lang, Window.Vinya.DOMElements.languages.value);
    Window.Vinya.DOMElements.display('spinner');
    Window.Vinya.player.unload().then(function () {
      Window.Vinya.videoOptions.id = Window.Vinya.videoList[videoName][Window.Vinya.DOMElements.languages.value];
      Window.Vinya.player.loadVideo(Window.Vinya.videoOptions).then( function () {
        Window.Vinya.player.ready().then(function(){
          if (languageChanged && Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.time)) {
            Window.Vinya.player.setCurrentTime(Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.time));
          }
          // hide spinner and display iframe
          Window.Vinya.DOMElements.hide('spinner');
          Window.Vinya.DOMElements.display('video');
        });
      });
    });
    if (!languageChanged) {
      Window.Vinya.functions.updateURL(Window.Vinya.URLParams.title, videoName);
    }
  }
};

/**
 * Determines if it is possible to load the desired video and displays
 * the appropriate response if it is not possible.
 * @returns whether or not the desired video is in the current video list.
 */
Window.Vinya.functions.videoPlayerPreCheck = function videoPlayerPreCheck(videoName) {
  if (Window.Vinya.videoList[videoName][Window.Vinya.DOMElements.languages.value] === undefined) {
    Window.Vinya.DOMElements.videoError.innerText = Window.Vinya.errorMsg;
    if (Window.Vinya.DOMElements.video != undefined) {
      Window.Vinya.DOMElements.hide('video');
    }
    Window.Vinya.DOMElements.hide('spinner');
    return false;
  }
  return true;
};

/**
 * Takes a param name and a value and stores that value as the value of the url param.
 * @param {String} param is the param that will added or updated with the val;
 * @param {*} val is the value to put in the url.
 */
Window.Vinya.functions.updateURL = function updateURL(param, val) {
  // when the video is changed, the time should be reset
  if (param === Window.Vinya.URLParams.title) {
    Window.Vinya.url.searchParams.delete(Window.Vinya.URLParams.time);
  }
  if (Window.Vinya.url.searchParams.has(param)) {
    Window.Vinya.url.searchParams.set(param, val);
  } else {
    Window.Vinya.url.searchParams.append(param, val);
  }
  // if the subtitles are turned off or the video is changed, remove the sub param
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.sub) && (param === Window.Vinya.URLParams.title || val == 'off' )) {
    Window.Vinya.url.searchParams.delete(Window.Vinya.URLParams.sub);
  }
  // update the browser history
  if (history.pushState) {
    window.history.pushState({path:Window.Vinya.url.href},'',Window.Vinya.url.href);
  }
  Window.Vinya.functions.updateStorage();
};

/**
 * Determines which if any of the videos are in the URL and displays
 * content appropriately.
 */
Window.Vinya.functions.parseURL = function parseURL() {
  var params = Window.Vinya.url.searchParams;
  var title = params.get(Window.Vinya.URLParams.title), lang = params.get(Window.Vinya.URLParams.lang), time = params.get(Window.Vinya.URLParams.time),
    sub = params.get(Window.Vinya.URLParams.sub);
  // check to see if the language and video title are present in the url
  if (params.has(Window.Vinya.URLParams.title) && params.has(Window.Vinya.URLParams.lang)) {
    // create the iframe and set the default value of the selects
    Window.Vinya.DOMElements.videoList.value = title;
    Window.Vinya.DOMElements.languages.value = lang;
  } else if (params.has(Window.Vinya.URLParams.title)) {
    // if the title is present but not the language, use the default language
    Window.Vinya.DOMElements.videoList.value = title;
    lang = Window.Vinya.DOMElements.languages.value;
  } else if (params.has(Window.Vinya.URLParams.lang)) {
    // if the language is present but not the title
    Window.Vinya.DOMElements.languages.value = lang;
    title = Window.Vinya.DOMElements.videoList.value;
  }
  Window.Vinya.functions.fixBtnDisplay(title);
  if (Window.Vinya.functions.videoPlayerPreCheck(title)) {
    Window.Vinya.functions.createVimeoPlayer(Window.Vinya.videoList[title][lang]);
  }
  // check to see if the time is in the url, if so the video will be set to that time
  if (params.has(Window.Vinya.URLParams.time)) {
    Window.Vinya.player.setCurrentTime(time);
  }
  if (params.has(Window.Vinya.URLParams.sub)) {
    Window.Vinya.player.enableTextTrack(sub);
  }
};

/**
 * Updates the url parameters in storage by removing all unnecesary url params. 
 */
Window.Vinya.functions.updateStorage = function updateStorage() {
  // a list of parameters to store in local storage
  var tempURL = new URL(Window.Vinya.url.href.substring(0, Window.Vinya.url.href.indexOf('?')));
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.sub)) {
    tempURL.searchParams.append(Window.Vinya.URLParams.sub, Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.sub));
  }
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.lang)) {
    tempURL.searchParams.append(Window.Vinya.URLParams.lang, Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.lang));
  }
  if (Window.Vinya.url.searchParams.has(Window.Vinya.URLParams.title)) {
    tempURL.searchParams.append(Window.Vinya.URLParams.title, Window.Vinya.url.searchParams.get(Window.Vinya.URLParams.title));
  }
  // store the parameters and current url base
  localStorage.setItem(Window.Vinya.localKey, tempURL.search);
};