(function ($) {
  window.setInterval(Drupal.mediaPlaylist.updatePopup, 2000);
  $(window).bind('mediaplaylistchanged', function() {
    window.resizeTo($('#page-wrapper').width() + 30, $('#page-wrapper').height()+80);
    window.focus();
  });
})(jQuery);
