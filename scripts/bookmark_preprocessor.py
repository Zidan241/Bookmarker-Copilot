import json

# Open and read the JSON file
with open("test_data/bookmark.json", "r") as file:
    data = json.load(file)

result = []

def fetch_bookmark(obj, path):
    if "url" in obj:
        result.append(f"{path};URL:{obj["url"]}")
        return
    path_arr = list(filter(str.strip, path.split(",")))
    path_len = len(path_arr) if path_arr else 0
    new_path = (f"RootFolder:{obj["title"]}" if path_len == 0 else f"{path};SubFolder{path_len}:{obj["title"]}") if len(obj["title"]) > 0 else path
    for folder in obj['children']:
        fetch_bookmark(folder, new_path)


fetch_bookmark(data[0],"")

print(result)