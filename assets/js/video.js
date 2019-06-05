document.addEventListener("DOMContentLoaded", function(){
  var languages = document.getElementById("languages");
  var videoList = document.getElementById("videos");
  var langBtns = document.querySelectorAll("#swapLanguage > p > a");
  var selectedLanguage;
  var selectedVideo;
  var videos;
  displayAppropriateVideoList();
  displaySelectedVideo();
  languages.addEventListener("change", displayAppropriateVideoList);
  videoList.addEventListener("change", displaySelectedVideo);
  // add listerner for click on language
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].setAttribute("href", fixURLForLanguage(langBtns[i].id));
  }

  /**
   * Displays the videos titles that are in the language specified by the language list.
   * It hides all of the others and makes sure that the selected option is of the language
   * selected;
   */
  function displayAppropriateVideoList() {
    // get the current language that is selected
    selectedLanguage = languages.options[languages.selectedIndex].value;
    videos = videoList.options;
    var video;
    var changeSelected = !videos[videoList.selectedIndex].classList.contains(selectedLanguage);
    for (var i = 0; i < videos.length; i++) {
      video = videos[i];
      if (video.classList.contains(selectedLanguage)) {
        // change the selected video to the first one encountered of the selected language
        if (changeSelected) {
          changeSelected = false;
          videoList.selectedIndex = i;
          displaySelectedVideo();
        }
        video.classList.remove("hidden");
      } else {
        video.classList.add("hidden");
      }
    }
    // display the select
    document.getElementById("videoOption").classList.remove("hidden");
  }

  /**
   * Displays the video selected by the user.
   */
  function displaySelectedVideo() {
    // hide the currently selected video
    if (selectedVideo !== undefined ) {
      selectedVideo.classList.remove("visible");
      selectedVideo.classList.add("hidden");
    }
    // display the selected video
    videos = videoList.options;
    var videoID = videos[videoList.selectedIndex].value;
    selectedVideo = document.getElementById(videoID);
    selectedVideo.classList.add("visible");
    selectedVideo.classList.remove("hidden");
  }

  /**
   * Updates the url to point to the rigth directory for the language selected.
   * @param lang is a string which is the language to swap the page to.
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
});