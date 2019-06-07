document.addEventListener("DOMContentLoaded", function(){
  var URLParams = {
    lang: "lang", 
    title: "video", 
    time: "time",
    sub: "sub"
  };
  var DOMElements = {
    languages: document.getElementById("languages"),
    videoList: document.getElementById("videos"),
    langBtns: document.querySelectorAll("#swapLanguage > p > a"),
    videoError: document.getElementById('videoError'),
    subtitles: document.getElementById('subtitles'),
    video: undefined
  };
  var selectedLanguage;
  var videoOptions = {
    id: undefined,
    width: 640,
    height: 564,
    autoplay: false
  };
  var player;
  var videos;
  var url = new URL(window.location.href);

  // preprocess check 
  if (URLContainsParam()) {
    // update the video accordingly based on the parameters
    parseURL();
  } else {
    displaySelectedVideo();
  }

  DOMElements.languages.addEventListener("change", updateLanguage);
  DOMElements.videoList.addEventListener("change", displaySelectedVideo);
  DOMElements.subtitles.addEventListener("change", function() {
    if (DOMElements.subtitles.value == 'off') {
      player.disableTextTrack();
    } else {
      player.enableTextTrack(DOMElements.subtitles.value);
    }
    updateURL(URLParams.sub, DOMElements.subtitles.value );
  });
  // add appropriate url for the language
  for (var i = 0; i < DOMElements.langBtns.length; i++) {
    DOMElements.langBtns[i].setAttribute("href", fixURLForLanguage(DOMElements.langBtns[i].id));
  }

  /**
   * Updates the selected language and updates the player;
   */
  function updateLanguage() {
    var langs = DOMElements.languages.options;
    selectedLanguage = langs[DOMElements.languages.selectedIndex];
    videos = DOMElements.videoList.options;
    updatePlayer(videos[DOMElements.videoList.selectedIndex].value, true);
  }

  /**
   * Displays the video selected by the user.
   */
  function displaySelectedVideo() {
    // display the selected video
    videos = DOMElements.videoList.options;
    var videoName = videos[DOMElements.videoList.selectedIndex].value;
    var langs = DOMElements.languages.options;
    selectedLanguage = langs[DOMElements.languages.selectedIndex];
    // hide the currently selected video
    if (player === undefined ) {
      createVimeoPlayer(videoName, selectedLanguage.value);
      updateURL(URLParams.title, videoName);
      updateURL(URLParams.lang, selectedLanguage.value);
    } else {
      updatePlayer(videoName, false);
    }
  }

  /**
   * Updates the url to point to the rigth directory for the language selected.
   * @param {String} lang is the language to swap the page to.
   * @return a string which is the url to use as a link to that language for 
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
   * Pauses the current video and updates the src of the iframe to
   * be that of the desired video if it exists. Otherwise an error
   * message is displayed to the user.
   * @param {String} videoName is the name of the video to display.
   * @param {Boolean} languageChanged is whether or not the language was changed.
   */
  function updatePlayer(videoName, languageChanged) {
    if (Window.Vinya[videoName][selectedLanguage.value] === undefined) {
      DOMElements.videoError.innerText = Window.Vinya.errorMsg;
      DOMElements.video = document.querySelector('iframe');
      DOMElements.video.setAttribute('class' , 'hidden');
    } else {
      DOMElements.video = document.querySelector('iframe');
      DOMElements.videoError.innerText = "";  
      DOMElements.video.setAttribute('class' , '');   
      updateURL(URLParams.lang, selectedLanguage.value);
      player.unload().then(function () {
        videoOptions.id = Window.Vinya[videoName][selectedLanguage.value];
        player.loadVideo(videoOptions).then( function () {
          player.ready().then(function(){
            if (languageChanged && url.searchParams.has(URLParams.time)) {
              player.setCurrentTime(url.searchParams.get(URLParams.time));
            }
            getTextTracks(); 
          });
        });
      });
      if (!languageChanged) {
        updateURL(URLParams.title, videoName);
      }
    }
  }

  /**
   * Takes a param name and a value and stores that value as the value of the url param.
   * @param {String} param is the param that will added or updated with the val;
   * @param {*} val is the value to put in the url.
   */
  function updateURL(param, val) {
    // when the video is changed, the time should be reset
    if (param === URLParams.title) {
      url.searchParams.delete(URLParams.time);
    }
    if (url.searchParams.has(param)) {
      url.searchParams.set(param, val)
    } else {
      url.searchParams.append(param, val);
    }
    // if the subtitles are turned off or the video is changed, remove the sub param
    if (url.searchParams.has(URLParams.sub) && (param === URLParams.title || val == 'off' )) {
      url.searchParams.delete(URLParams.sub);
    }
    // update the browser history
    if (history.pushState) {
      window.history.pushState({path:url.href},'',url.href);
    }
  }

  /**
   * Determines which if any of the videos are in the URL and displays
   * content appropriately.
   */
  function parseURL() {
   var params = url.searchParams;
   var title = params.get(URLParams.title), lang = params.get(URLParams.lang), time = params.get(URLParams.time);
   // check to see if the language and video title are present in the url
   if (params.has(URLParams.title) && params.has(URLParams.lang)) {
      // create the iframe and set the default value of the selects
      DOMElements.videoList.value = title;
      DOMElements.languages.value = lang;
    } else if (params.has(URLParams.title)) {
      // if the title is present but not the language, use the default language
      DOMElements.videoList.value = title;
      lang = DOMElements.languages.value;
    } else if (params.has(URLParams.lang)) {
      // if the language is present but not the title
      DOMElements.languages.value = lang;
      title = DOMElements.videoList.value;
    }
    createVimeoPlayer(title, lang);
    // check to see if the time is in the url, if so the video will be set to that time
    if (params.has(URLParams.time)) {
      player.setCurrentTime(time);
    }
  }

  function URLContainsParam() {
    var paramExists = false;
    Object.keys(URLParams).forEach(function (key) {
      if (url.searchParams.has(URLParams[key])) {
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
    // create iframe
    videoOptions.id = Window.Vinya[videoName][videoLanguage];
    player = new Vimeo.Player('videosFrames', videoOptions);
    DOMElements.video = document.querySelector('iframe');
    player.on("timeupdate", updateURLTime); // updates the url time when progress is made in the video
    getTextTracks();
  }

  /**
   * updates the time in the url.
   */
  function updateURLTime() {
    player.getCurrentTime().then(function(seconds) {
      updateURL(URLParams.time, seconds);
    })
  }
  
  function getTextTracks() {
    // remove all added tracks
    var elements = document.querySelectorAll('.added');
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
    // add the new ones
    player.getTextTracks().then(function(tracks) {
      console.log(tracks);
      var subtitle;
      if (tracks.length !== 0) {
        // append all options to the list
        for (var i = 0; i < tracks.length; i++) {
          if (tracks[i].kind === 'subtitles') {
            subtitle = '<option value=' + tracks[i].language + ' class="added">' + tracks[i].label + '</option>';
            DOMElements.subtitles.innerHTML += subtitle;
          }
        }
      }
      if (!document.querySelector('.added[value="' + url.searchParams.get(URLParams.sub) + '"]')) {
        updateURL(URLParams.sub, 'off');
      }
    });
  }
});