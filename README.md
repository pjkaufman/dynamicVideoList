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

These parameters are defined and used in JavaScript:

- lang - the language of the video
- video - the name of the video to play
- time - the time in the video to start the video at
- sub - the language to have the subtitles set to
- list - the video list that is currently in use

## Modifying

### Video List

The video list is where both the Dynamic Video Player and Video Language Player get their video ids from.

You can do any of three things to modify the video list:

1. Modify the yaml config file `user\config\video.yaml` to modify or add a video list. This is the default way that the Dynamic Video Player and Video Language Player get their video list.

2. Create a new config file and add the video list there.

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

1. Modify the yaml config file `user\config\video.yaml` to modify the language lsit. This is the default way that the Dynamic Video Player and Video Language Player get their language list.

2. Create a new config file and add the language list there.

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

If using the videoLists template, the language list will follow this pattern:
``` YAML
languages: 
  [name_of_video_list]:
    en:
      - name: English
        code: en
      - name: Spanish
        code: es
      - name: French
        code: fr
```

### URL Parameters

The URL Parameters are defined in `user\themes\quark\templates\` in a script tag in any of the custom templates (videos.html.twig, video.html.twig, and subtitles.html.twig).

The list should look something like this:
``` JSON
{
  lang: "[lang_param_name_to_display]", 
  title: "[video_param_name_to_display]", 
  time: "[video_time_param_name_to_display]",
  sub: "[subtitle_param_name_to_display]",
  list: "[video_list_param_name_to_display]"
}
```

### Subtitle List

This list must be modified in Vimeo. 

### Visible Options

When editing any of the custom template files (videos.html.twig, video.html.twig, subtitles.html.twig, or any template that extends videos.html.twig), there are 6 blocks to note.

1. The **videoSelect** block which allows the user to select from a video list defined in either `user\config\video.yaml`, a user defined config file, or the YAML front matter of the page.

2. The **languageSelect** block which allows the user to select a language from the language list defined in either `user\config\video.yaml`, a user defined config file, or the YAML front matter of the page.

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

### YAML Front Matter Options

| Name | Value and What It Does | Default | Required |
| ---- | ---------------------- | ------- | -------- |
| `configFile` | The name of the config file to use | video | Optional |
| `defaultList` | The name of the default video list to use. It is needed for the videoLists template | NA | Optional* |
| `languageListConfig` | Either true or false. It determines whether the language list will be founnd in a config file. | true | Optional |
| `listContainer` | The name of the video list that contains the other video lists. It is needed for the videoLists template. _Note: it will have no affect if the videoLists template is not being used._ | NA | Optional* |
| `pageIdentifier` | Should be a string of characters unique to the page. It allows for the storing of user based information. </br> _Note: if two different pages have the same pageIdentifier value the data stored about the user will be the same for both and can override the data of the other page._ | NA | Required |
| `textListConfig` |Either true or false. It determines whether the text options to display to the user will be found in a config file.  The text list includes the error message displayed to the user and the text that is above the select boxes. | true | Optional |
| `videoID` | Should be a valid Vimeo id and is only needed for the subtitles template. </br> _Note: an invalid id value will cause the video to not load._ | NA | Optional* |
| `videoList` | The name of the video list(s) to use. It is needed for the videos, video, and videoLists template. _Note: the videoLists template is the only one that use multiple video lists_ | NA | Optional* |
| `videoListConfig` | Either true or false. It determines whether the video list to use is found in a config file. | true | Optional |
| `videoTitle` | The name of a video in the specified video list to use. It is needed for the video template. | NA | Optional* |

_* Optional unless using the specified template(s)._

_Note: if any list is being read from the YAML front matter it does not need the language based option except the titles option of the videos list. For example languages has `en` and `es` for language options in the config files, but they are not needed when it is in the front matter._

### Resources

The JavaScript files are located in `user/themes/quark/js/videoPlayer/`, and the CSS files are located in `user/themes/quark/css/videoPlayer/`.

If any modification is made to these files, run the following in the base directory of the repository in a terminal or command prompt window that you are not currently using because it will continue running until you manually stop it:
```
npm run-script build
```
This command will concatenate and then minify all css files, concatenate and minify all specified JavaScript file recipes, and watch for any changes in these files in which case it will reminifiy and concatenate the appropriate files.

_Note: it will be necessary that you run `npm install` in the base directory before running this command for the first time._

## Types

There are four different types of video player templates setup in this repository. 

1. Dynamic Video Player

This video player allows the user to select a video from the video list, a language from the languages list, and a subtilte from a list of subtitles which is loaded with the video.

In order to use this template, make sure the Markdown files is called `videos.*.md` or `videos.md`.

2. Video Language Player

This video player allows the user to select a language from the languages list and a subtilte from a list of subtitles which is loaded with the video.

In order to use this template, make sure the Markdown files is called `video.*.md` or `video.md`.

3. Video Player

This video player allows the user to select a subtilte from a list of subtitles which is loaded with the video.

In order to use this template, make sure the Markdown files is called `subtitles.*.md` or `subtitles.md`.

4. Video Lists Player

This player is like the Dynamic Video Player except it also allows for multiple video lists that the user can select and the ability to have different language lists for each video list.

In order to use this template, make sure the Markdown files is called `videoLists.*.md` or `videoLists.md`.

## Uses

- [Grav](https://getgrav.org/)
- [Vimeo API](https://github.com/vimeo/player.js#vimeo-player-api---)
- [Gulp via Node for concatenating and minifying resources](https://gulpjs.com/)
