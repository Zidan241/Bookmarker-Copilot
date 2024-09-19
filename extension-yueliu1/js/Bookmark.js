export default class Bookmark {
  constructor() {
    document.addEventListener('DOMContentLoaded', function () {
      chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        buildBookmarkTree(bookmarkTreeNodes[0].children);
      });
    });

    function buildBookmarkTree(bookmarkNodes, parentElement = document.getElementById('bookmarkTree')) {
      bookmarkNodes.forEach(function (node) {
        let li;
        // Check if node is a folder or a bookmark
        if (node.children) {
          li = document.createElement('li');
          li.className = 'list-item-folder';
          li.innerHTML = `
              <div class="list-container">
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
          const chevron = li.querySelector('.icon-20px');
          let isExpanded = false;
          chevron.addEventListener('click', function () {
              isExpanded = !isExpanded;
              li.querySelector('ul').style.display = isExpanded ? 'block' : 'none';
              chevron.classList.toggle('down', isExpanded);
          });
        
          // Create the nested UL element with padding for indentation
          let nestedUl = document.createElement('ul');
          nestedUl.style.display = "none"; // Initially hidden
          li.appendChild(nestedUl);

          // Recursively build the tree for child nodes
          buildBookmarkTree(node.children, nestedUl);
        } else {
          let faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}`;
          //TODO: Fix can't load edge://favicon2 resource issue
          //let faviconUrl = `chrome://favicon/${node.url}`;          
          li = document.createElement('li');
          li.className = 'list-item-link';        
          li.innerHTML = `
              <div class="list-container">
                  <img class="icon-20px" alt="Favicon" src="${faviconUrl}">
                  <div class="text2">
                      <a class="list-item-text" href="${node.url}" title="${node.title}" target="_blank" rel="noreferrer">${node.title}</a>
                  </div>
              </div>
          `;
        }
        parentElement.appendChild(li);
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
