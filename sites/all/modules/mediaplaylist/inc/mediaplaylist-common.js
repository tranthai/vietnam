(function ($) {

// Add handlers to play/queue links on audio nodes.
Drupal.behaviors.mediaplaylistLinks = {
  attach: function (context, settings) {
    $('a.mediaplaylist-link-queue')
      .html(Drupal.t('Add to playlist'))
      .addClass('mediaplaylist-add-playlist')
      .click(function() {
        Drupal.mediaPlaylist.click('enqueue', this);
        return false;
      });

    //$('a.mediaplaylist-link-queue').addClass('mediaplaylist-add-playlist').click(function() {Drupal.mediaPlaylist.click('enqueue', this.href, $(this).attr('title')); return false;});
  }
}

// Initialize the player object.
Drupal.mediaPlaylist = {};

// Queue and recently played.
Drupal.mediaPlaylistQueue = function(queuename, limit) {
  var queue = this;
  queue.get = function() {
    var q = Drupal.mediaPlaylist.store('mediaplaylist-' + queuename);
    return q ? JSON.parse(q) : [];
  };
  queue.set = function(items) {
    var q = JSON.stringify(items);
    Drupal.mediaPlaylist.store('mediaplaylist-' + queuename, q);
  };
  queue.stringify = function() {
    return Drupal.mediaPlaylist.store('mediaplaylist-' + queuename);
  };
  queue.push = function(item) {
    this.addItem('push', item);
  };
  queue.pop = function() {
    return this.getItem('pop');
  };
  queue.unshift = function(item) {
    this.addItem('unshift', item);
  };
  queue.shift = function() {
    return this.getItem('shift');
  };
  queue.first = function() {
    var q = this.get();
    return q.length ? q[i] : null;
  };
  queue.last = function() {
    var q = this.get();
    return q.length ? q[q.length-1] : null;
  };
  queue.getItem = function(method) {
    // Method should be pop or shift
    var q = this.get();
    var item = q[method]();
    this.set(q);
    return item;
  };
  queue.addItem = function(method, item) {
    // Method should be push or unshift
    var q = this.get();

    // Remove an item if we are at the limit.
    if (limit) {
      while (q.length >= limit) {
        q[method == 'push' ? 'shift' : 'pop']();
      }
    }

    q[method](item);
    this.set(q);
  };
  queue.removeItem = function(item) {
    // Method should be push or unshift
    var q = this.get();
    for (i = 0; i < q.length; i++) {
      if (q[i].nid == item.nid) {
        q.splice(i, 1);
      }
    }
    this.set(q);
  };
  queue.empty = function() {
    this.set([]);
  };
};

Drupal.mediaPlaylist.queue = new Drupal.mediaPlaylistQueue('queue');
Drupal.mediaPlaylist.recents = new Drupal.mediaPlaylistQueue('recentlyplayed', 5);


// Play/Queue Link Handling Functions
Drupal.mediaPlaylist.click = function(action, link) {
  // Get the nid from the settings.
  var nid, title;
  var id = $(link).attr('id');
  if (id && Drupal.settings.mediaplaylist.playlinks[id]) {
    nid = Drupal.settings.mediaplaylist.playlinks[id].nid;
  }
  title = $(link).attr('title');

  // Run the action specified.
  if (nid && $.isFunction(Drupal.mediaPlaylist[action])) {
    Drupal.mediaPlaylist[action](nid, title);
  }
};
Drupal.mediaPlaylist.play = function(nid, title) {
  Drupal.mediaPlaylist.queue(nid, title);
}
Drupal.mediaPlaylist.enqueue = function(nid, title) {
  Drupal.mediaPlaylist.openPopup();
  var q = Drupal.mediaPlaylist.queue.push({nid: nid, title: title});
}

// Utility Functions.
Drupal.mediaPlaylist.store = function(name, value) {
  return $.cookie(name, value, {path: Drupal.settings.basePath});
}

// Popup handling functions.
Drupal.mediaPlaylist.openPopup = function() {
  if (!Drupal.mediaPlaylist.checkPopup()) {
    // Added 9/26/11 - Name main window for child target
    window.name = "main-window";
    // window.open(Drupal.settings.basePath + 'mediaplaylist/popup', "mediaplaylist", "status=0,toolbar=0,scrollbars=yes,resizable=yes,height=400,width=400");
    window.open(Drupal.settings.basePath + 'mediaplaylist/popup', "mediaplaylist", "status=0,toolbar=0,scrollbars=yes,resizable=yes,height=550,width=960");    
    Drupal.mediaPlaylist.updatePopup();
  }
}
Drupal.mediaPlaylist.updatePopup = function() {
  Drupal.mediaPlaylist.store('mediaplaylist-popup-checkin', new Date().getTime());
}
Drupal.mediaPlaylist.checkPopup = function() {
  var checkin = Drupal.mediaPlaylist.store('mediaplaylist-popup-checkin');
  // The popup should check in frequently to inform the parent window that it's still open and active.
  // If there hasn't been a recent checkin then report the player popup as inactive so a new one can be opened.
  if (checkin && ((new Date().getTime()) - checkin) < 3000) {
    return true;
  }
  return false;
}

})(jQuery);
