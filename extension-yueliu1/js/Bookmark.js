export default class Bookmark {
  constructor() {
    document.addEventListener('DOMContentLoaded', function() {
      function createTree(node, parentElement) {
        let li = document.createElement("li");

        li.style.paddingLeft = 16 + "px";

        // Check if node is a folder or a bookmark
        if (node.children) {
          li.classList.add("folder");
      
          // Create arrow icon for folder (toggle indicator)
          let arrowIcon = document.createElement("i");
          arrowIcon.className = "arrow right"; // Initially pointing right
          li.appendChild(arrowIcon);

          // Create folder icon
          let folderIcon = document.createElement("i");
          folderIcon.className = "folder-icon";
          li.appendChild(folderIcon);

          // Set folder title
          let span = document.createElement("span");
          span.textContent = node.title;
          li.appendChild(span);

          // Add click event to toggle folder
          li.addEventListener("click", function() {
            event.stopPropagation();  // Prevents click events from propagating upwards
            li.classList.toggle("open");
      
            // Toggle the arrow's direction and show/hide nested contents
            ul.style.display = ul.style.display === "none" ? "block" : "none";
            arrowIcon.classList.toggle("down");
          });

          // Create the nested UL element with padding for indentation
          let ul = document.createElement("ul");
          ul.style.display = "none"; // Initially hidden
          li.appendChild(ul);

          // Recursively build the tree for child nodes
          node.children.forEach((child) => createTree(child, ul));
        } else {
          li.classList.add("bookmark");

          // Create favicon for bookmark
          let favicon = document.createElement("i");
          favicon.className = "favicon";
          let faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}`;
          //TODO: Fix can't load edge://favicon2 resource issue
          //let faviconUrl = `chrome://favicon/${node.url}`;
          favicon.style.backgroundImage = `url(${faviconUrl})`;
      
          // Append favicon and title
          li.appendChild(favicon);
          let a = document.createElement("a");
          a.href = node.url;
          a.textContent = node.title;
          a.target = "_blank";
          li.appendChild(a);
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
        //this.bindEventListener();
      });
    });
    this.initI18n()
  }

  initI18n() {
    let i18n = chrome.i18n
    this.i18n = {
      btnAdd: i18n.getMessage('btnAdd'),
      btnGenerate: i18n.getMessage('btnGenerate'),
      btnRegenerate: i18n.getMessage('btnRegenerate'),
      btnAdjust: i18n.getMessage('btnAdjust'),
      btnDiscard: i18n.getMessage('btnDiscard'),
      btnApply: i18n.getMessage('btnApply'),
      inputBoxTitle: i18n.getMessage('inputBoxTitle'),
      appName: i18n.getMessage('appName'),
    }
    $('.btnAdd').val(this.i18n.btnAdd)
    $('.btnGenerate').val(this.i18n.btnGenerate)
    $('.btnRegenerate').val(this.i18n.btnRegenerate)
    $('.btnAdjust').val(this.i18n.btnAdjust)
    $('.btnDiscard').text(this.i18n.btnDiscard)
    $('.btnApply').text(this.i18n.btnApply)
  }
}