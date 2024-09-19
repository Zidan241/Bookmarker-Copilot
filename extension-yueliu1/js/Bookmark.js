export default class Bookmark {
  constructor() {
    document.addEventListener('DOMContentLoaded', function() {
      function createTree(node, parentElement) {
        let li = document.createElement("li");
        // Check if node is a folder or a bookmark
        if (node.children) {
          li.style.paddingLeft = 16 + "px";
          li.classList.add("folder");
          //li.className = 'list-item-folder';
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
          let listContainer = li.querySelector('.list-container');
          let chevron = li.querySelector('.icon-20px');
          let isExpanded = false;
          listContainer.addEventListener('click', function () {
              isExpanded = !isExpanded;
              li.querySelector('ul').style.display = isExpanded ? 'block' : 'none';
              chevron.classList.toggle('down', isExpanded);
          });

          // Create the nested UL element with padding for indentation
          let ul = document.createElement("ul");
          ul.style.display = "none"; // Initially hidden
          li.appendChild(ul);

          // Recursively build the tree for child nodes
          node.children.forEach((child) => createTree(child, ul));
        } else {
          li.style.paddingLeft = 40 + "px";
          li.classList.add("bookmark");

          // Create favicon for bookmark
          let faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}`;
          //TODO: Fix can't load edge://favicon2 resource issue
          //let faviconUrl = `chrome://favicon/${node.url}`;
          li.innerHTML = `
              <div class="list-container">
                  <img class="icon-20px" alt="Favicon" src="${faviconUrl}">
                  <div class="text2">
                      <a class="list-item-text" href="${node.url}" title="${node.title}" target="_blank" rel="noreferrer">${node.title}</a>
                  </div>
              </div>
          `;
          let listContainer = li.querySelector('.list-container');
          let link = li.querySelector('a');
          listContainer.addEventListener('click', () => {
            link.click();
          });
        }

        parentElement.appendChild(li);
      }
      // Fetch the bookmarks and build the tree
      chrome.bookmarks.getTree(bookmarkTreeNodes => {
        let treeContainer = document.getElementById("bookmarkTree");
        // Only process the children of the root node (Bookmark Bar, Other Bookmarks, Mobile Bookmarks)
        let rootChildren = bookmarkTreeNodes[0].children;
        rootChildren.forEach((rootChild) => {
          createTree(rootChild, treeContainer);
        });
      });
    });
    this.initI18n()
  }

  initI18n() {
    let i18n = chrome.i18n
    this.i18n = {
      btnGenerate: i18n.getMessage('btnGenerate'),
      btnAdjust: i18n.getMessage('btnAdjust'),
      btnDiscard: i18n.getMessage('btnDiscard'),
      btnApply: i18n.getMessage('btnApply'),
      appName: i18n.getMessage('appName'),
    }
   document.getElementById('btnGenerate').innerText = this.i18n.btnGenerate;
   document.getElementById('btnAdjust').innerText = this.i18n.btnAdjust;
   document.getElementById('btnDiscard').innerText = this.i18n.btnDiscard;
   document.getElementById('btnApply').innerText = this.i18n.btnApply;
   document.getElementById('appName').innerText = this.i18n.appName;
  }
}