function addBookmark(title, url, parentId) {
    chrome.bookmarks.create({
        parentId: parentId,
        title: title,
        url: url
    });
}

async function addCurrentTabToBookmark(parentId) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    addBookmark(tab.title, tab.url, parentId);
}

function fetchBookmarks() {
    return chrome.bookmarks.getTree(); 
}

async function formatModelInput() {
    const bookmarks = await fetchBookmarks();


}

function formatModelInputHelper(Obj, path) {
    
}

async function getMostSuitableFolder() {
    // Configuration
    const API_KEY = "YOUR_API_KEY"
    const headers = {
        "Content-Type": "application/json",
        "api-key": API_KEY,
    }

    // Payload for the request
    const payload = {
    "messages": [
        {
        "role": "system",
        "content": [
            {
            "type": "text",
            "text": "You are an AI assistant that helps people find information."
            }
        ]
        }
    ],
    "temperature": 0.7,
    "top_p": 0.95,
    "max_tokens": 800
    }

    const ENDPOINT = "https://bookmark-copilot.openai.azure.com/openai/deployments/GPT-4/chat/completions?api-version=2024-02-15-preview"

    // Send request
    try{
        const response = await fetch(ENDPOINT, {
            method: "Post",
            body: JSON.stringify(payload),
            headers:headers
        });

    } catch(error){
        console.log(error.message);
    }
}