(function ($) {


/**
 * Attach the child dialog behavior to new content.
 */
Drupal.mediaPlaylistPlayer = {};
Drupal.mediaPlaylistPlayer.playListQueueSerialized  = '';
Drupal.mediaPlaylistPlayer.playListQueueItems       = [];
Drupal.mediaPlaylistPlayer.playListRecentlyPlayed   = [];

Drupal.behaviors.mediaPlaylistPlayer = {
  attach: function (context, settings) {
    // Set target for node-related links to parent window
    jQuery('.node-detail a').not('.fieldlayout-region-top a').attr('target','main-window');

    Drupal.behaviors.mediaPlaylistPlayer.initializePlayer(context);

    // Attach the updater/dragging to the playlist
    $('#mediaplaylist-playlist-wrapper', context).not('.mediaplaylist-processed').each(function() {
      window.setInterval(Drupal.mediaPlaylistPlayer.updatePlaylist, 200);

      Drupal.mediaPlaylistPlayer.playlistItemTemplate = $('.mediaplaylist-playlist-item', context).remove();
      Drupal.mediaPlaylistPlayer.recentItemTemplate = $('.mediaplaylist-recent-item', context).remove();

      $('.mediaplaylist-playlist-clear').click(function() {
        Drupal.mediaPlaylist.queue.empty();
      });

      $('#mediaplaylist-playlist', this).sortable({
        placeholder: 'mediaplaylist-playlist-placeholder',
        cursor: 'move',
        axis: 'y',
        update: Drupal.mediaPlaylistPlayer.sortPlaylist
      });
      $('#mediaplaylist-playlist', this).disableSelection();
    }).addClass('mediaplaylist-processed');

    $('#mediaplaylist-player', context).not('.mediaplaylist-processed').each(function() {
      Drupal.mediaPlaylistPlayer.start();
    });

    $(window).trigger('mediaplaylistchanged');
  }
}
$('document').unload(function() {Drupal.mediaPlaylist.store('mediaplaylist-popup-open', '')});

Drupal.behaviors.mediaPlaylistPlayer.initializePlayer = function(context) {
  // Override the jplayer next button.
  if (typeof Drupal != 'undefined' && typeof Drupal.jPlayer != 'undefined') {
    Drupal.jPlayer.next = Drupal.mediaPlaylistPlayer.next;
  }
  $('.jp-jplayer', context).bind($.jPlayer.event.ended, Drupal.mediaPlaylistPlayer.next); 
  //$('.jp-jplayer', context).bind($.jPlayer.event.progress, function(e){Drupal.mediaPlaylistPlayer.updatePlayPosition(e.jPlayer.status.currentPercentAbsolute);});
  
  // Override the jplayer prev button.
  if (typeof Drupal != 'undefined' && typeof Drupal.jPlayer != 'undefined') {
    Drupal.jPlayer.previous = Drupal.mediaPlaylistPlayer.prev;
  }
};

Drupal.mediaPlaylistPlayer.updatePlaylist = function() {
  // Update the upcoming queue.
  var q = Drupal.mediaPlaylist.queue.get(), serialized = Drupal.mediaPlaylist.queue.stringify();
  if (serialized != Drupal.mediaPlaylistPlayer.playListQueueSerialized) {
    $('#mediaplaylist-playlist').empty();
    for (i in q) {
      $('#mediaplaylist-playlist').append(Drupal.mediaPlaylistPlayer.createPlaylistItem(q[i], Drupal.mediaPlaylistPlayer.playlistItemTemplate));
    }

    // Add a new item in the queue message:
    if (q.length > Drupal.mediaPlaylistPlayer.playListQueueItems.length) {
      var last = Drupal.mediaPlaylist.queue.last();
      Drupal.mediaPlaylistPlayer.showMessage('<em>'+last.title+'</em> has been added to your playlist');
    }

    Drupal.mediaPlaylistPlayer.start();
    Drupal.mediaPlaylistPlayer.playListQueueSerialized  = serialized;
    Drupal.mediaPlaylistPlayer.playListQueueItems       = q;

    $(window).trigger('mediaplaylistchanged');
  }
  // Update the recently played list.
  var q = Drupal.mediaPlaylist.recents.get(), serialized = Drupal.mediaPlaylist.recents.stringify();
  if (serialized != Drupal.mediaPlaylistPlayer.playListRecentlyPlayed) {
    $('#mediaplaylist-recent').empty();
    for (i in q) {
      $('#mediaplaylist-recent').append(Drupal.mediaPlaylistPlayer.createPlaylistItem(q[i], Drupal.mediaPlaylistPlayer.recentItemTemplate));
    }
    Drupal.mediaPlaylistPlayer.playListRecentlyPlayed = serialized;
    $(window).trigger('mediaplaylistchanged');
  }
};

Drupal.mediaPlaylistPlayer.createPlaylistItem = function(item, template) {
  if (item && item.nid && item.title) {
    var out = template.clone();
    out.find('.mediaplaylist-playlist-item-title').text(item.title);
    out.find('.mediaplaylist-playlist-item-remove').click(function() {
      Drupal.mediaPlaylist.queue.removeItem(item);
    });
    out.find('.mediaplaylist-playlist-item-playnow').click(function() {
      Drupal.mediaPlaylist.queue.removeItem(item);
      Drupal.mediaPlaylist.queue.unshift(item);
      Drupal.mediaPlaylistPlayer.next();
    });
    out.find('.mediaplaylist-playlist-item-queue').click(function() {
      Drupal.mediaPlaylist.queue.push(item);
    });
    out.data('playlistItem', item);
    return out;
  }
}

Drupal.mediaPlaylistPlayer.updatePlayPosition = function(position) {
  Drupal.mediaPlaylist.store('mediaplaylist-popup-playhead', position);
};

Drupal.mediaPlaylistPlayer.showMessage = function(text) {
  if (Drupal.mediaPlaylistPlayer.messageTimeout) {
    clearTimeout(Drupal.mediaPlaylistPlayer.messageTimeout)
  }
  $('#mediaplaylist-message').slideUp();
  $('.mediaplaylist-message-content').html(text);
  $('#mediaplaylist-message').slideDown();

  Drupal.mediaPlaylistPlayer.messageTimeout = setTimeout(function() {
    $('#mediaplaylist-message').slideUp();
    Drupal.mediaPlaylistPlayer.messageTimeout = null;
  }, 5000);
};

Drupal.mediaPlaylistPlayer.sortPlaylist = function(event, ui) {
  var q = [];
  $('li', event.target).each(function() {
    q.push($(this).data('playlistItem'));
  });
  Drupal.mediaPlaylist.queue.set(q);
};

Drupal.mediaPlaylistPlayer.next = function() {
  var next = Drupal.mediaPlaylist.queue.shift();
  if (next) {
    var playing = Drupal.mediaPlaylistPlayer.nowPlaying();
    if (playing) {
      Drupal.mediaPlaylist.recents.push(playing);
    }
    Drupal.mediaPlaylistPlayer.nowPlaying(next);
    Drupal.mediaPlaylistPlayer.updatePlaying();
  }
};

Drupal.mediaPlaylistPlayer.prev = function() {
  var prev = Drupal.mediaPlaylist.recents.shift();
  if (prev) {
    var playing = Drupal.mediaPlaylistPlayer.nowPlaying();
    if (playing) {
      Drupal.mediaPlaylist.queue.unshift(playing);
    }
    Drupal.mediaPlaylistPlayer.nowPlaying(prev);
    Drupal.mediaPlaylistPlayer.updatePlaying();
  }
};

Drupal.mediaPlaylistPlayer.updatePlaying = function() {
  var playing = Drupal.mediaPlaylistPlayer.nowPlaying();
  // Update the invisible nid field and force an ajax callback.
  if (playing && playing.nid && $('#mediaplaylist-player #node-'+playing.nid).length == 0) {
    Drupal.mediaPlaylistPlayer.loadSegment(playing.nid);
  }
};

Drupal.mediaPlaylistPlayer.loadSegment = function(nid) {
  // Update the invisible nid field and force an ajax callback.
  $('#mediaplaylist-player').html('<div class="mediaplaylist-loading">Loading</div>');
  $('#edit-nid').val(nid).change();
};

Drupal.mediaPlaylistPlayer.nowPlaying = function(value) {
  if (typeof value != 'undefined') {
    Drupal.mediaPlaylist.store('mediaplaylist-nowplaying', JSON.stringify(value));
  }
  return JSON.parse(Drupal.mediaPlaylist.store('mediaplaylist-nowplaying'));
};

Drupal.mediaPlaylistPlayer.start = function() {
  if (Drupal.mediaPlaylistPlayer.nowPlaying()) {
    Drupal.mediaPlaylistPlayer.updatePlaying();
  }
  else {
    Drupal.mediaPlaylistPlayer.next();
  }
};

Drupal.mediaPlaylistPlayer.resume = function() {
  if (Drupal.mediaPlaylistPlayer.nowPlaying()) {
    Drupal.mediaPlaylistPlayer.updatePlaying();
  }
  else {
    Drupal.mediaPlaylistPlayer.next();
  }
};

})(jQuery);
