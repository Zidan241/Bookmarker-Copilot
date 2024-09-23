async function addBookmark(title, url, parentId) {
    return chrome.bookmarks.create({
        parentId: parentId,
        title: title,
        url: url
    });
}

async function getCurrentActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

async function fetchBookmarks() {
    return chrome.bookmarks.getTree(); 
}

async function generateModelInput() {
    const bookmarks = await fetchBookmarks();
    const result = [];
    await generateModelInputHelper(bookmarks[0], "", result);
    return result;
}

async function generateModelInputHelper(obj, path, result) {
    if(obj.url){
        const urlObj = new URL(obj.url);
        result.push(`${path}:<Title>${obj.title}</Title>:<Domain>${urlObj.hostname}</Domain>`);
        return;
    }
    const pathArr = path.split(":").filter(Boolean);
    const pathLen = pathArr.length;
    const newPath = obj.title.length > 0 ? (pathLen == 0 ? `<RootFolder>${obj.title}</RootFolder>` : `${path}:<SubFolder${pathLen}>${obj.title}</SubFolder${pathLen}>`) : path;
    const children = obj.children;
    for (var i in children) {
        generateModelInputHelper(children[i], newPath, result);
    }
}

export async function getMostSuitableFolder(url, title, permanentNodes) {
    // Configuration
    const API_KEY = "API_KEY";
    const headers = {
        "Content-Type": "application/json",
        "api-key": API_KEY,
    };

    // Payload for the request
    const modelInput = await generateModelInput(); 
    updateProgress(25);  // Get response, progress is 25%
    const body = 
        `Below is a bookmark list. For each Url We have the RootFolder and the the SubFolders that it is in if it is in a SubFolder Given this Url and it's Title Where should this Url be placed in this bookmark file system Output the path of where it will be placed. If the current file structure is not suitable suggest a new folder to put the new url in. Return **only** the folder path in the following format RootFolder > SubFolder 1 > ... .
        <Domain>${url}</URL><Title>${title}</Tiltle>
        Bookmarks:${JSON.stringify(modelInput)}`;
    const payload = {
        "messages": [
            {
                "role": "system",
                "content": [
                    {
                    "type": "text",
                    "text": "You are an AI assistant that helps people find the most suitable folder for their bookmarks."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": body
                    },
                ]
            }
        ],
        "temperature": 2,
        "top_p": 0,
        "max_tokens": 2048
    };
    const ENDPOINT = "https://bookmark-copilot.openai.azure.com/openai/deployments/GPT-4/chat/completions?api-version=2024-02-15-preview";
    try {
        // Send request
        const response = await fetch(ENDPOINT, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: headers
        });
        updateProgress(50);  // Get response, progress is 50%
        const responseJson = await response.json();
        const pNodes = await permanentNodes;
        updateProgress(75);  // Get json, progress is 75%
        for(const value of pNodes){
            const resultArray = extractAndSplit(responseJson.choices[0].message.content, value.title);
            if(resultArray.length > 0)
                return resultArray;
        }
        return responseJson.choices[0].message.content.split('>').map(e=>e.trim());
    } catch(error){
        console.log(error.message);
    }
}

function extractAndSplit(inputString, keyword) {
    const regex = new RegExp(`${keyword} > [^"\n]*`);
    const match = inputString.match(regex);
    if (match) {
        let resultString = match[0].replace(/["\n*]/g, '');
        let resultList = resultString.split(' > ');
        return resultList;
    } else {
        return [];
    }
}

export async function addActiveTabToBookmarks (bookmarkList) {
    let newAddedBookmark = [];
    updateProgress(5);  // Start, progress is 5%
    const activeTab = await getCurrentActiveTab();
    updateProgress(10);  // Get tab, progress is 10%
    const permanentNodes = chrome.bookmarks.getChildren("0");
    const folderArr = await getMostSuitableFolder(activeTab.url, activeTab.title, permanentNodes);
    console.log(folderArr);
    updateProgress(90);  // Return folder path, progress is 90%
    var bookmarks = (await fetchBookmarks())[0].children;
    console.log(bookmarks);
    var folderIdSoFar = "1"; // default folder id should be bookmark bar
    // for loop instead of search to handel more complex folder structures
    for (var i in folderArr) {
        var folderFound = false;
        for (var j in bookmarks) {
            console.log(folderArr[i]);
            console.log(bookmarks[j].title);
            if (bookmarks[j].children && bookmarks[j].title === folderArr[i]) {
                folderFound = true;
                folderIdSoFar = bookmarks[j].id
                bookmarks = bookmarks[j].children;
                break;
            }
        }
        if (!folderFound) {
            const newFolder = await addBookmark(folderArr[i], null, folderIdSoFar);
            // append new folder id to newAddedBookmark array
            newAddedBookmark.push(newFolder.id);
            bookmarkList.createHightlightFolder(newFolder);
            folderIdSoFar = newFolder.id;
            bookmarks = [];
        }
    }
    updateProgress(100);  // progress is 100%
    const newBookmark = await addBookmark(activeTab.title, activeTab.url, folderIdSoFar);
    // append new url id to newAddedBookmark array
    newAddedBookmark.push(newBookmark.id);
    bookmarkList.ScrollAndhighlight(newBookmark);
    return newAddedBookmark;
}

function updateProgress(percentage) {
    const progressBar = document.querySelector('.track');
    progressBar.style.width = percentage + '%'; // Set width based on the progress percentage
}