function addBookmark(title, url, parentId) {
    chrome.bookmarks.create({
        parentId: parentId,
        title: title,
        url: url
    });
}

async function getCurrentActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function fetchBookmarks() {
    return chrome.bookmarks.getTree(); 
}

async function generateModelInput() {
    const bookmarks = await fetchBookmarks();
    const result = [];
    await generateModelInputHelper(bookmarks[0], "", result);
    return result;
}

async function generateModelInputHelper(obj, path, result) {
    if(obj["url"]){
        const urlObj = new URL(obj["url"]);
        result.push(`${path}:<Title>${obj["title"]}</Title>:<Domain>${urlObj.hostname}</Domain>`);
        return;
    }
    const pathArr = path.split(":").filter(Boolean);
    const pathLen = pathArr.length;
    const newPath = obj["title"].length > 0 ? (pathLen == 0 ? `<RootFolder>${obj["title"]}</RootFolder>` : `${path}:<SubFolder${pathLen}>${obj["title"]}</SubFolder${pathLen}>`) : path;
    const children = obj["children"];
    for(const i in children) {
        generateModelInputHelper(children[i], newPath, result);
    }
}

export async function getMostSuitableFolder() {
    // Configuration
    const API_KEY = "64e59578582e42fb856999e1e656f5c7";
    const headers = {
        "Content-Type": "application/json",
        "api-key": API_KEY,
    };

    // Payload for the request
    const activeTab = await getCurrentActiveTab();
    const modelInput = await generateModelInput(); 
    const body = 
        `Below is a bookmark list. For each Url We have the RootFolder and the the SubFolders that it is in if it is in a SubFolder Given this Url and it's Title Where should this Url be placed in this bookmark file system Output the path of where it will be placed. If the current file structure is not suitable suggest a new folder to put the new url in. Return **only** the folder path in the following format RootFolder > SubFolder 1 > ... .
        <Domain>${activeTab.url}</URL><Title>${activeTab.title}</Tiltle>
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
    }
    const ENDPOINT = "https://bookmark-copilot.openai.azure.com/openai/deployments/GPT-4/chat/completions?api-version=2024-02-15-preview"
    try {
        // Send request
        const response = await fetch(ENDPOINT, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: headers
        });
        const responseJson = await response.json();
        return responseJson.choices[0].message.content.split('>').map(e=>e.trim());
    } catch(error){
        console.log(error.message);
    }
}
