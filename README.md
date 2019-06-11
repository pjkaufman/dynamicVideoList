# Dynamic Video List

Allows a user to dynamically choose what video they want to watch based on the episode title and language.

## Table of Contents

- [Installation](#Installation)
  - [Dependencies](#Dependencies)
- [Features](#Features)
  - [Dynamic Video Selection](#Dynamic-Video-Selection)
  - [URL Parameters](#URL-Parameters)
- [Modifying](#Modifying)
  - [Video List](#Video-List)
  - [Language List](#Language-List)
  - [URL Parameters](#URL-Parameters-1)
  - [Subtitle List](#Subtitle-List)
- [Uses](#Uses)

## Installation

Run the following command:

```
git clone https://github.com/pjkaufman/dynamicVideoList.git
```

Then copy the files from the git repository and paste them in the web content folder of your server.

### Dependencies

- [Grav](https://getgrav.org/) must be installed and in place first.

## Features

### Dynamic Video Selection

This is possible due to having the ids of the Vimeo videos.

The id  is taken in by the Vimeo API and used to load the desired video.

### URL Parameters

These parameters are defined and used in Javascript

- lang - the language in which to check for the video in
  - _Note: this parameter is needed if url parameters are present_
- video - the name of the video to play
- time - the time in the video to start the user at
- sub - the language to have the subtitles set to

## Modifying

### Video List

You need to modify the yaml front matter in `user\pages\01.videos\*.md` to modify the video list.

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

You need to modify the yaml front matter in `user\pages\01.videos\*.md` to modify the language list.

It will look something like: 
``` YAML
languages: 
  - name: English
    code: en
  - name: Spanish
    code: es
  - name: French
    code: fr
```

### URL Parameters

The URL Parameters are defined in `user\themes\quark\templates\video.html.twig` in a script tag.

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

## Uses

- [Vimeo API](https://github.com/vimeo/player.js#vimeo-player-api---)
