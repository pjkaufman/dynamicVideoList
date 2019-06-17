"use strict";
document.addEventListener("DOMContentLoaded", function(){
  Window.Vinya.DOMElements = {
    languages: document.getElementById("languages"),
    videoList: document.getElementById("videos"),
    langBtns: document.querySelectorAll("#swapLanguage > p > a"),
    videoError: document.getElementById('videoError'),
    subtitles: document.getElementById('subtitles'),
    spinner: document.getElementById('loading'),
    video: undefined,
    hide: function (property) {
      if (this[property].classList.length.length === 0) {
        this[property].setAttribute('class', 'hidden');
      } else {
        this[property].classList.add('hidden');
      } 
    },
    display: function (property) {
      if (this[property].classList.length.length === 0) {
        this[property].setAttribute('class', '');
      } else {
        this[property].classList.remove('hidden');
      } 
    }
  };
  Window.Vinya.videoOptions = {
    id: undefined,
    autoplay: false,
    title: false,
    byline: false
  };
  Window.Vinya.player;
  Window.Vinya.url = new URL(window.location.href);

  // preprocess check 
  if (Window.Vinya.URLContainsParam()) {
    // update the video accordingly based on the parameters
    Window.Vinya.parseURL();
  } else {
    Window.Vinya.displaySelectedVideo();
  }
  // add the event listeners for the page
  Window.Vinya.addEventListeners();

  // add appropriate url for the language
  for (var i = 0, length = Window.Vinya.DOMElements.langBtns.length; i < length; i++) {
    Window.Vinya.DOMElements.langBtns[i].setAttribute("href", Window.Vinya.fixURLForLanguage(Window.Vinya.DOMElements.langBtns[i].id));
  }
});