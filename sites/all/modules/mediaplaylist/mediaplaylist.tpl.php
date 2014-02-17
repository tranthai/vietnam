<?php
/**
 * @file
 * Basic template file for the playlist.
 */
?>
<div id="mediaplaylist-wrapper">
  <div id="mediaplaylist-message"><div class="mediaplaylist-message-content"></div></div>
  <div id="mediaplaylist-lists">
    <div id="mediaplaylist-playlist-wrapper">
      <h2>Playlist</h2>
      <div id="mediaplaylist-playlist-scroll">
        <ul id="mediaplaylist-playlist">
          <li class="mediaplaylist-playlist-item">
            <span class="mediaplaylist-drag-handle"></span>
            <span class="mediaplaylist-playlist-item-title"></span>
            <span class="mediaplaylist-playlist-item-actions">
              <a href="#" class="mediaplaylist-playlist-item-playnow">play now</a>
              <a href="#" class="mediaplaylist-playlist-item-remove">remove</a>
            </span>
          </li>
        </ul>
      </div>
      <a href="#" class="mediaplaylist-playlist-clear">clear playlist</a>
    </div>
    <div id="mediaplaylist-recent-wrapper">
      <h2>Recently Played</h2>
      <ul id="mediaplaylist-recent">
        <li class="mediaplaylist-recent-item">
          <span class="mediaplaylist-playlist-item-title"></span>
          <span class="mediaplaylist-playlist-item-actions">
            <a href="#" class="mediaplaylist-playlist-item-queue">add to playlist</a>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div id="mediaplaylist-player"></div>
  <?php echo $loader ?>
</div>
