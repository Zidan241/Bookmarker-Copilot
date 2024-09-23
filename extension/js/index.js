import Bookmark from './Bookmark.js'
import { addActiveTabToBookmarks } from './Functions.js'
$(document).ready(function() {
  $('#btnLike').click(function() {
    console.log('Like button clicked');
  });
  $('#btnDislike').click(function() {
    console.log('Dislike button clicked');
  });

  // Get the button and menu elements
  const copilotBtn = document.getElementById('copilotBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  // Toggle dropdown visibility on button click
  copilotBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });
  // Close dropdown if clicking outside the menu
  document.addEventListener('click', (event) => {
    if (!copilotBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  // Listen for clicks on dropdown items
  const dropdownItems = document.querySelectorAll('.menu-list-item');
  const generateOutputView = document.getElementById('generateOutputView');
  const toolbar = document.getElementsByClassName('toolbar')[0];
  $('#btnApply').click(function() {
    toolbar.classList.remove('show');
  });
  $('#btnGenerate').click(function() {
    console.log('Dislike button clicked');
  });
  $('#btnAdjust').click(function() {
    console.log('Like button clicked');
  });
  $('#btnDiscard').click(function() {
    toolbar.classList.remove('show');
  });
  dropdownItems.forEach(item => {
    if(item.id === 'btnReorganize' || item.id === 'btnSearch') {
      item.classList.add('disabled');
    }
    item.addEventListener('click', (event) => {
      if (!item.classList.contains('disabled')) {
        console.log(`${item.textContent} clicked`);
        dropdownMenu.classList.remove('show');  // Close the dropdown after selection
        switch (item.id) {
          case 'btnReorganize':
            break;
          case 'btnAddToFolder':
            generateOutputView.classList.add('show');
            addActiveTabToBookmarks(bookmarkList).then(() => {
              setTimeout(() => {
                // Show 100% progress then hide the output view
                generateOutputView.classList.remove('show');
                toolbar.classList.add('show');
              }, 1000);
            });
            break;
          case 'btnSearch':
            break;
        }
      }
    });
  });  
});

let bookmarkList = new Bookmark();