document.addEventListener("DOMContentLoaded", function(){
  var languages = document.getElementById("languages");
  var videoList = document.getElementById("videos");
  var selectedLanguage;
  var selectedVideo;
  var videos;
  displayAppropriateVideoList();
  displaySelectedVideo();
  languages.addEventListener("change", displayAppropriateVideoList);
  videoList.addEventListener("change", displaySelectedVideo);

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
   * displays the video selected by the user.
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
});