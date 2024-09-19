export default class Bookmark {
  constructor() {
    document.addEventListener('DOMContentLoaded', function () {
      chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        buildBookmarkTree(bookmarkTreeNodes[0].children);
      });
    });

    function buildBookmarkTree(bookmarkNodes, parentElement = document.getElementById('bookmarkTree')) {
      bookmarkNodes.forEach(function (node) {
        let div;
        // Check if node is a folder or a bookmark
        if (node.children) {
          div = document.createElement('div');
          div.className = 'list-item-folder';
          div.innerHTML = `
              <div class="list-container">
                  <div class="checkmark-control1"></div>
                  <img class="icon-20px" alt="Toggle" src="img/Chevron.svg">
                  <div class="item">
                      <div class="favicon-wrapper">
                          <img class="folder-icon" alt="Folder" src="img/folder_icon.png">
                      </div>
                      <div class="align-text">
                          <div class="label">${node.title}</div>
                      </div>
                  </div>
              </div>
          `;

          // Add click event to toggle folder
          const chevron = div.querySelector('.icon-20px');
          let isExpanded = false;
          chevron.addEventListener('click', function () {
              const ul = div.querySelector('ul');
              if (isExpanded) {
                  chevron.src = 'img/Chevron.svg';
                  ul.style.display = 'none';
              } else {
                  chevron.src = 'img/Chevron-down.svg';
                  ul.style.display = 'block';
              }
              isExpanded = !isExpanded;
          });

          // Create the nested UL element with padding for indentation
          let ul = document.createElement("ul");
          ul.style.display = "none"; // Initially hidden
          div.appendChild(ul);

          // Recursively build the tree for child nodes
          buildBookmarkTree(node.children, ul);
        } else {
          let faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}`;
          //TODO: Fix can't load edge://favicon2 resource issue
          //let faviconUrl = `chrome://favicon/${node.url}`;          
          div = document.createElement('div');
          div.className = 'list-item-link';
          div.innerHTML = `
              <div class="list-container">
                  <div class="checkmark-control1"></div>
                  <img class="icon-20px" alt="Favicon" src="${faviconUrl}">
                  <div class="text2">
                      <a class="list-item-text" href="${node.url}" title="${node.title}" target="_blank" rel="noreferrer">${node.title}</a>
                  </div>
              </div>
          `;
        }
        parentElement.appendChild(div);
      });
    }
  }

  initI18n() {
    let i18n = chrome.i18n;
    this.i18n = {
      btnAdd: i18n.getMessage('btnAdd'),
      btnGenerate: i18n.getMessage('btnGenerate'),
      btnRegenerate: i18n.getMessage('btnRegenerate'),
      btnAdjust: i18n.getMessage('btnAdjust'),
      btnDiscard: i18n.getMessage('btnDiscard'),
      btnApply: i18n.getMessage('btnApply'),
      inputBoxTitle: i18n.getMessage('inputBoxTitle'),
      appName: i18n.getMessage('appName'),
    };

    $('.btnAdd').val(this.i18n.btnAdd);
    $('.btnGenerate').val(this.i18n.btnGenerate);
    $('.btnRegenerate').val(this.i18n.btnRegenerate);
    $('.btnAdjust').val(this.i18n.btnAdjust);
    $('.btnDiscard').text(this.i18n.btnDiscard);
    $('.btnApply').text(this.i18n.btnApply);
  }
}
