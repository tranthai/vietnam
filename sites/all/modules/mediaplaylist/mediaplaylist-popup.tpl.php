<?php

/**
 * @file
 * Basic templcate file for the popup window.
 */
?>

<div id="page-wrapper" class="popup mediaplaylistpopup"><div id="page">

  <?php if (!empty($messages)): ?>
    <div id="messages"><div class="section clearfix">
      <?php print $messages; ?>
    </div></div> <!-- /.section, /#messages -->
  <?php endif; ?>

  <div id="main-wrapper" class="clearfix"><div id="main" class="clearfix">
    <div id="content" class="column"><div class="section">
      <a id="main-content"></a>
      <?php if (!empty($title)): ?>
        <h1 class="title" id="page-title">
          <?php print $title; ?>
        </h1>
      <?php endif; ?>
      <?php print render($page['content']); ?>

    </div></div> <!-- /.section, /#content -->

  </div></div> <!-- /#main, /#main-wrapper -->

</div></div> <!-- /#page, /#page-wrapper -->
