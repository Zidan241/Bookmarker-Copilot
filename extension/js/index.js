import { Bookmark } from './Bookmark.js'
import { addActiveTabToBookmarks } from './Functions.js'
$(document).ready(function() {
  $('#smartOrganizeBtn').click(function() {
    console.log('Smart organize button clicked');
    addActiveTabToBookmarks(bookmarkList);
  });
  $('#btnLike').click(function() {
    console.log('Like button clicked');
  });
  $('#btnDislike').click(function() {
    console.log('Dislike button clicked');
  });
  $('#btnApply').click(function() {
    console.log('Keep it button clicked');
  });

  $('#btnGenerate').click(function() {
    console.log('Regenerate button clicked');
  });

  $('#btnAdjust').click(function() {
    console.log('Adjust button clicked');
  });

  $('#btnDiscard').click(function() {
    console.log('Discard button clicked');
  });
});

let bookmarkList = new Bookmark();