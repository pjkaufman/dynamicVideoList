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
- [Types](#Types)
- [Uses](#Uses)

## Installation

Run the following command:

```
git clone https://github.com/pjkaufman/dynamicVideoList.git
```

Then copy the files from the git repository and paste them in the web content folder of your server.

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

You need to modify the yaml front matter in `user\config\video.yaml` to modify the video list.

It will look something like: 
``` YAML
videos: 
  - name: [name_to_display_here]
    ids: 
      - id: [id_for_video]
        language: [code_of_language_to_list_the_video_as]
```
_Note: you can add as many elements to ids as you like as long as the language is in the language list (see below) and the id  is a valid Vimeo id._

### Language List

You need to modify the yaml in `user\config\video.yaml` to modify the language list.

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
This list should have a language code for each part of the conditional stamement found in `user\themes\quark\templates\videos.html.twig`. It looks something like this:

``` Twig
{% if grav.language.getActive == "en" %}
   {% set select = config.video.select.en %}
   {% set error = config.video.error.en %}
   {% set languages = config.video.languages.en %}
{% else %}
   {% set select = config.video.select.es %}
   {% set error = config.video.error.es %}
   {% set languages = config.video.languages.es %}
{% endif %}
```

_Note: if a language is added to the languages list, the `user\themes\quark\templates\videos.html.twig` must be modified to set the appropriate variables in the conditional block._

### URL Parameters

The URL Parameters are defined in `user\themes\quark\templates\videos.html.twig` in a script tag.

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

When editing any of the custom template files (videos.html.twig, video.html.twig, subtitles.html.twig, or any template that extends videos.html.twig), there are 5 blocks to note.

1. The **videoSelect** block which allows the user to select from the video list defined in `user\config\video.yaml`.

2. The **languageSelect** block which allows the user to select a language from the language list defined in `user\config\video.yaml`.

3. The **subtitleSelect** block which allows the user to select a subtitle from the subtitle list defined in Vimeo.

4. The **inlineScript** block which allows for slight variations in the setup for the player via the YAML front matter and initial url parameter reading.

5. The **javascriptFunctions** block which deals directly with all the functions that are defined differently for each video player.

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

There are three different types of video player templates setup in this repository.

1. Dynamic Video Player

This video player allows the user to select a video from the video list defined in and a language from the languages list which are both defined in `user\config\video.yaml` as well as a subtilte from a list of subtitles which is loaded with the video.

In order to use this template, make sure the Markdown files is called `videos.*.*md` or `videos.md`.

2. Video Language Player

This video player allows the user to select a language from the languages list which is defined in `user\config\video.yaml` as well as a subtilte from a list of subtitles which is loaded with the video.

This option requires that in the YAML front matter of the page there is an option called `videoTitle`. videoTitle corresponds to the name of one of the video names listed in the video list in `user\config\video.yaml`.

In order to use this template, make sure the Markdown files is called `video.*.*md` or `video.md`.

3. Video Player

This video player allows the user to select a subtilte from a list of subtitles which is loaded with the video.

This option requires that in the YAML front matter of the page there is an option called `videoTitle` and `videoLanguage`. videoTitle corresponds with the name of one of the video names listed in the video list. videoLanguage corresponds with the name of one of the languages listed in the language list. Both of this lists can be found in `user\config\video.yaml`.

In order to use this template, make sure the Markdown files is called `subtitles.*.*md` or `subtitles.md`.

## Uses

- [Grav](https://getgrav.org/)
- [Vimeo API](https://github.com/vimeo/player.js#vimeo-player-api---)
