

***********
** DRAFT **
***********



DESCRIPTION
-----------

This module adds playlist and queuing functionality to the Media 
module.


INTRODUCTION
------------

The Media Playlist module is somewhat unlike other Drupal modules in 
that it requires a bit more effort and decision making than normal 
to get going. The reason for this additional effort is that the 
module is meant to be extremely flexible.

The module is designed to work with a variety of other "Modules that 
Extend the Media Module" (http://groups.drupal.org/node/168009), 
such as jPlayer (http://drupal.org/project/jplayer), Mediafront 
(http://drupal.org/project/mediafront), Remote Stream Wrapper 
(http://drupal.org/project/remote_stream_wrapper), and the Media 
Module itself (http://drupal.org/project/media).

The Media Playlist module was originally built for Wisconsin Public
Radio and used on the Drupal 7 website for the nationally-distributed 
show, To the Best of Our Knowledge (http://ttbook.org). 


EXAMPLE INSTALLATION WITH jPLAYER
---------------------------------

1. Download and enable the Media Playist 
(http://drupal.org/sandbox/ronan/1342724) and jPlayer 
(http://drupal.org/project/jplayer) modules. Install jPlayer according
to the directions in the jPlayer README.txt file.

2. Add a new field to the "Basic page" content type 
(admin/structure/types/manage/page/fields) with the following 
specifications:

  Label: Audio
  Name: field_audio
  Field: File
  Widget: File

3. Save the field and accept all defaults, except under "Allowed 
file extensions" change "txt to "mp3" (or whatever audio format 
you have).

4. On the "Basic page" content type, on the "Manage Display" tab,
change the format of the Audio field to "Media Playlist Links." 

5. On the same "Manage Display" tab, click the "Media Playlist"
secondary tab, move the Audio out of the hidden section, change 
the Audio field to "jPlayer - Player," and click Save.

6. Again on the same "Manage Display" tab, under the two other
secondary tabs -- "Teaser" and "Default" -- change the format of
the format of the Audio field to "Media Playlist Links."

7. Create some basic pages, using the Title field for song title and
upload the associated mp3, ogg, etc.
