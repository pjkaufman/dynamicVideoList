document.addEventListener("DOMContentLoaded", function(){
  var URLParams = {lang: "lang", title: "video", time: "time"};
  var languages = document.getElementById("languages");
  var videoList = document.getElementById("videos");
  var iframeContainer = document.getElementById("videosFrames");
  var langBtns = document.querySelectorAll("#swapLanguage > p > a");
  var videoError = document.getElementById('videoError');
  var selectedLanguage;
  var video;
  var player;
  var videos;
  var url = new URL(window.location.href);

  // preprocess check 
  if (URLContainsParam()) {
    parseURL();
  } else {
    displaySelectedVideo();
  }

  languages.addEventListener("change", updateLanguage);
  videoList.addEventListener("change", displaySelectedVideo);
  // add listerner for click on language
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].setAttribute("href", fixURLForLanguage(langBtns[i].id));
  }

  /**
   * Updates the selected language and updates the player;
   */
  function updateLanguage() {
    var langs = languages.options;
    selectedLanguage = langs[languages.selectedIndex];
    videos = videoList.options;
    updatePlayer(videos[videoList.selectedIndex].value);
  }

  /**
   * Displays the video selected by the user.
   */
  function displaySelectedVideo() {
    // display the selected video
    videos = videoList.options;
    var videoName = videos[videoList.selectedIndex].value;
    var langs = languages.options;
    selectedLanguage = langs[languages.selectedIndex];
    // hide the currently selected video
    if (video === undefined ) {
      createPlayerAndIframe(videoName, selectedLanguage.value);
      updateURL(URLParams.title, videoName);
      updateURL(URLParams.lang, selectedLanguage.value);
    } else {
      updatePlayer(videoName);
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
   */
  function updatePlayer(videoName) {
    player.pause().then(function() {
      console.log('the video was paused');
    });
    if (Window.Vinya[videoName][selectedLanguage.value] === undefined) {
      videoError.innerText = Window.Vinya.errorMsg;
      video.setAttribute("class", "hidden");
    } else {
      videoError.innerText = "";
      video.setAttribute("src", Window.Vinya[videoName][selectedLanguage.value]);
      video.setAttribute("class", "");
      updateURL(URLParams.title, videoName);
      updateURL(URLParams.lang, selectedLanguage.value);
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
      createPlayerAndIframe(title, lang);
      videoList.value = title;
      languages.value = lang;
    } else if (params.has(URLParams.title)) {
      // if the title is present but not the language, use the default language
      videoList.value = title;
      console.log("no language found");
    } else if (params.has(URLParams.title)) {
      // if the language is present but not the title
      languages.value = lang;
      console.log("no title found");
    }
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
   * Creates an iframe using the video name and language to select the appropriate link for the video.
   * @param {String} videoName is the name of the video to select.
   * @param {String} videoLanguage is the language to get the video in.
   */
  function createPlayerAndIframe(videoName, videoLanguage) {
    // create iframe
    console.log(videoName + " : " + videoLanguage);
    var iframe = '<iframe src="' + Window.Vinya[videoName][videoLanguage] + '" width="640" height="564" frameborder="0" allow="fullscreen"' +
    'allowfullscreen id="iframeVideo"></iframe>';
    // add iframe to the DOM
    iframeContainer.insertAdjacentHTML('beforeend', iframe);
    // keep a reference to the selected video
    video = document.getElementById('iframeVideo');
    console.log(video);
    player = new Vimeo.Player(video);
    player.on("timeupdate", updateURLTime); // updates the url time when progress is made in the video
    player.on("pause", updateURLTime); // updates the url time when the video is paused
    player.on("bufferend", updateURLTime); // updates the url time when the video is paused
  }

  /**
   * updates the time in the url.
   */
  function updateURLTime() {
    player.getCurrentTime().then(function(seconds) {
      updateURL(URLParams.time, seconds);
    })
  }
});