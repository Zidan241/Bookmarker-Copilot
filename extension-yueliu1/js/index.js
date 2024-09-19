import Bookmark from './Bookmark.js'
$(document).ready(function() {
  $('#smartOrganizeBtn').click(function() {
    console.log('Smart organize button clicked');
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

let myBookmarkList = new Bookmark();
addCurrentTab();

function addCurrentTab() {
  //const folderName = "Suggested Folder"; //Or suggested id?
  const folderName = "hackathon_folder"; //Or suggested id?
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.bookmarks.search({ title: folderName }, (results) => {
          if (results.length === 0) {
              chrome.bookmarks.create({ title: folderName , parentId:'1'/*set default root folder as bookmar bar*/}, (folder) => {
                createHightlightFolder(folder);
                addBookmarkToFolder(folder.id, activeTab);
              });
          } else {
              addBookmarkToFolder(results[0].id, activeTab);
          }
      });
  });
}

function createHightlightFolder(node){
  let li = document.createElement("li");
  //li.classList.add("highlight-folder");
  myBookmarkList.InitFolderElement(li, node);
  // Create the nested UL element with padding for indentation
  let ul = document.createElement("ul");
  ul.style.display = "none"; // Initially hidden
  li.appendChild(ul);


  // Recursively expand the tree by parent_id
  openParentFolder(node.parentId);

  let parent_element = document.getElementById(node.parentId);
  parent_element.appendChild(li);
}

function openParentFolder(parent_id){
  if(parent_id != '0'){
    let parent_li = document.getElementById(parent_id);
    parent_li.querySelector('ul').style.display = 'block';
    let chevron = parent_li.querySelector('.icon-20px');
    chevron.classList.toggle('down', true);
    chrome.bookmarks.get(parent_id, (parentNode) => {
      openParentFolder(parentNode.parentId);
    });
  }
}

function addBookmarkToFolder(folderId, activeTab) {
    chrome.bookmarks.create({
        parentId: folderId,
        title: activeTab.title,
        url: activeTab.url
    }, (newBookmark) => {
      ScrollAndhighlight(folderId);
    });
}

function ScrollAndhighlight(folderId) {
//  let li = document.createElement("li");
/*  chrome.bookmarks.getSubTree(folderId, (nodes) => {
      if (nodes.length > 0) {
          const folderNode = nodes[0];
          chrome.bookmarks.getChildren(folderNode.id, (children) => {
              console.log("Folder contents:", children);
              alert(`Bookmark added to folder "${folderNode.title}" and folder expanded!`);
          });
      }
  });*/
}