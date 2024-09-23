import Bookmark from './Bookmark.js'
import { addActiveTabToBookmarks } from './Functions.js'
$(document).ready(function() {
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
  // Get the button and menu elements
  const copilotBtn = document.getElementById('copilotBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const generateOutputView = document.getElementById('generateOutputView');

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
              }, 1000);
            });
            break;
          case 'btnSearch':
            break;
        }
      }
    });
  });  

  // Listen for clicks on dropdown items
  const generateOutput = document.querySelectorAll('.output-loader');
/*  generateOutput.forEach(item => {
    item.addEventListener('click', (event) => {
      if (!item.classList.contains('disabled')) {
        console.log(`${item.textContent} clicked`);
        dropdownMenu.classList.remove('show');  // Close the dropdown after selection
        switch (item.id) {
          case 'btnReorganize':
            break;
          case 'btnAddToFolder':
            addActiveTabToBookmarks(bookmarkList);
            break;
          case 'btnSearch':
            break;
        }
      }
    });
  });  */
});

let bookmarkList = new Bookmark();