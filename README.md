# Dynamic Video List

Allows a user to dynamically choose what video they want to watch based on the episode title and language.

## Table of Contents

- [Installation](#Installation)
- [Features](#Features)
  - [Dynamic Video Selection](#Dynamic-Video-Selection)
  - [URL Parameters](#URL-Parameters)
- [Modifying](#Modifying)
  - [Video List](#Video-List)
  - [Language List](#Language-List)
  - [URL Parameters](#URL-Parameters-1)
  - [Subtitle List](#Subtitle-List)
  - [Visible Options](#Visible-Options)
  - [YAML Front Matter Options](#YAML-Front-Matter-Options)
  - [Resources](#Resources)
    - [JavaScript](#JavaScript)
    - [CSS](#CSS)
- [Types](#Types)
- [Uses](#Uses)

## Installation

Run the following command in the web content folder of your server:
```
git clone https://github.com/pjkaufman/dynamicVideoList.git
```

### Configuration

modify the [language list](#Language-List) and [video list](#Video-List) according to your needs.

## Features

### Dynamic Video Selection

This is possible due to having the ids of the Vimeo videos.

The id is taken in by the Vimeo API and used to load the desired video.

### URL Parameters

These parameters are defined and used in Javascript

- lang - the language in which to check for the video in
- video - the name of the video to play
- time - the time in the video to start the user at
- sub - the language to have the subtitles set to

## Modifying

### Video List

The video list is where both the Dynamic Video Player and Video Language Player get their video IDs from.

You can do any of three things to modify the video list:

1. Modify the yaml config file `user\config\video.yaml` to modify or add a video list. This is the default way that the Dynamic Video Player and Video Player get their video list.

2. Create a new config file and add the video list there. <br> _Note: this option requires that the language list and text based options be defined in the config file as well._

3. Create the video list in the YAML front matter of the page. <br> _Note: this option does not require the use of more than the default language for the page in the title option._

The video list looks something like: 
``` YAML
[name_of_video_list]: 
  - name: [name_to_display_here]
    title:
        en: [English_video_name]
        es: [Spanish_video_name]
    ids: 
      - id: [id_for_video]
        language: [code_of_language_to_list_the_video_as]
```

The title option is only needed for the Dynamic Video Player.

_Note: you can add as many elements to ids as you like as long as the language is in the language list (see below) and the id  is a valid Vimeo id._

### Language List

The list that contains the languages that the videos are available in and the language code for the language.

You can do any of three things to modify the language list:

1. Modify the yaml config file `user\config\video.yaml` to modify the language lsit. This is the default way that the Dynamic Video Player and Video Player get their language list.

2. Create a new config file and add the language list there. <br> _Note: this option requires that the video list and text based options be defined in the config file as well._

3. Create the language list in the YAML front matter of the page. <br> _Note: this option does not require the use of the two character language code which store the list of languages and their display name for the language._

It will look something like: 
``` YAML
languages: 
  en:
    - name: English
      code: en
    - name: Spanish
      code: es
    - name: French
      code: fr
```
This list should have a language code for each language you plan to support (the YAML code above would only support English) unless using the YAML front matter of the page.

### URL Parameters

The URL Parameters are defined in `user\themes\quark\templates\` in a script tag in any of the custom templates (videos.html.twig, video.html.twig, and subtitles.html.twig).

The list should look something like this:
``` JSON
{
  lang: "[lang_param_name_to_display]", 
  title: "[video_param_name_to_display]", 
  time: "[video_time_param_name_to_display]",
  sub: "[subtitle_param_name_to_display]"
}
```

### Subtitle List

This list must be modified in Vimeo. 

### Visible Options

When editing any of the custom template files (videos.html.twig, video.html.twig, subtitles.html.twig, or any template that extends videos.html.twig), there are 6 blocks to note.

1. The **videoSelect** block which allows the user to select from a video list defined in either `user\config\video.yaml`, a user defined config file, or the YAML front matter of the page.

2. The **languageSelect** block which allows the user to select a language from the language list defined ineither `user\config\video.yaml`, a user defined config file, or the YAML front matter of the page.

3. The **subtitleSelect** block which allows the user to select a subtitle from the subtitle list defined in Vimeo.

4. The **inlineScript** block which allows for slight variations in the setup for the player via the YAML front matter and initial url parameter reading.

5. The **javascriptFunctions** block which deals directly with all the functions that are defined differently for each video player.

6. The **videoOptions** block which allows the user to navigate forward and backwards between videos with ease.

If you would like to remove any of these blocks from a template that extends videos.html.twig, just add the following to the your custom template:
```Twig
{% block [Block Name Here] %}       
{% endblock %}
```

In order to modify any of these blocks, add the following to your template:
```Twig
{% block [Block Name Here] %}     
  [Your Code Here] 
{% endblock %}
```

## Types

There are three different types of video player templates setup in this repository. Each player requires that in the YAML front matter of the page there is an option called [`pageIdentifier`](#pageIdentifier). 

1. Dynamic Video Player

This video player allows the user to select a video from the video list, a language from the languages list, and a subtilte from a list of subtitles which is loaded with the video.

This option requires that in the YAML front matter of the page there is an option called [`videoList`](#videoList).

In order to use this template, make sure the Markdown files is called `videos.*.*md` or `videos.md`.

2. Video Language Player

This video player allows the user to select a language from the languages list and a subtilte from a list of subtitles which is loaded with the video.

This option requires that in the YAML front matter of the page there are options called [`videoTitle`](#videoTitle) and [`videoList`](#videoList). 

In order to use this template, make sure the Markdown files is called `video.*.*md` or `video.md`.

3. Video Player

This video player allows the user to select a subtilte from a list of subtitles which is loaded with the video.

This option requires that in the YAML front matter of the page there is an option called [`videoID`](#videoID). 

In order to use this template, make sure the Markdown files is called `subtitles.*.*md` or `subtitles.md`.

### YAML Front Matter Options

| Name | Value and What It Does | Default | Required |
| ---- | ---------------------- | ------- | -------- |
| <p id="configFile">`configFile`</p> | The name of the config file to use | video | Optional |
| <p id="languageListConfig">`languageListConfig`</p> | Either true or false. It determines whether the language list to use is defined in a config file or the Front Matter of the page. | true | Optional |
| <p id="pageIdentifier">`pageIdentifier`</p> | Should be sting of characters unique to the page. It allows for the storing of user based information. </br> _Note: if two different pages have the same pageIdentifier value the data stored about the user will be the same for both and can override the data of the other page_ | NA | Required |
| <p id="textListConfig">`textListConfig`</p> |Either true or false. It is used to determine whether the text options to display to the user are defined in a config file or the Front Matter of the page. The text list includes the error message displayed to the user and the text that is above the select boxes. | true | Optional |
| <p id="videoID">`videoID`</p> | Should be a valid Vimeo ID and is only needed for the subtitles template. </br> _Note: an invalid ID value will cause the video to not load_ | NA | Optional* |
| <p id="videoList">`videoList`</p> | The name of the video list to use. It can either be defined in the Front Matter of the page or a config file. It is the key for the video list. It is needed for both the videos and video template. | NA | Optional* |
| <p id="videoListConfig">`videoListConfig`</p> | Either true or false. It is used to determine whether the video list to use is found in a config file or the Front Matter of the page. | true | Optional |
| <p id="videoTitle">`videoTitle`</p> | The name of a video in the specified video list to use and is only needed for the video template. | NA | Optional* |
_* Optional unless using the specified template_

_Note: if any list is being read from the YAML Front Matter it does not need the language based option except the titles option of the videos list. For example languages has en and es for language options in the config files, but they are not needed when it is in the Front Matter._

### Resources

The JavaScript files are located in `user/themes/quark/js/videoPlayer/` and the CSS files are located in `user/themes/quark/css/videoPlayer/`.

If any modification is made to these files, run the following in the base directory of the repository in command window that you are not currently using because it will continue running until you manually stop it:
```
npm run-script build
```
This command will concatenate and then minify all css files, concatenate and minify all specified JavaScript file recipes, and watch for any changes in these files in which case it will reminifiy and concatenate the appropriate files.

## Uses

- [Grav](https://getgrav.org/)
- [Vimeo API](https://github.com/vimeo/player.js#vimeo-player-api---)
- [Gulp via Node for concatenating and minifying resources](https://gulpjs.com/)
