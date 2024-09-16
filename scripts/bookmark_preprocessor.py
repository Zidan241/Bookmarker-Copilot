import json

# Open and read the JSON file
file_name = "bookmark"
with open(f"test_data/{file_name}.json", "r") as file:
    data = json.load(file)

result = []

def fetch_bookmark(obj, path):
    if "url" in obj:
        result.append(f"{path}:<Title>{obj["title"]}</Title>:<URL>{obj["url"]}</URL>")
        return
    path_arr = list(filter(str.strip, path.split(":")))
    path_len = len(path_arr) if path_arr else 0
    new_path = (f"<RootFolder>{obj["title"]}</RootFolder>" if path_len == 0 else f"{path}:<SubFolder{path_len}>{obj["title"]}</SubFolder{path_len}>") if len(obj["title"]) > 0 else path
    for folder in obj['children']:
        fetch_bookmark(folder, new_path)


fetch_bookmark(data[0],"")

with open(f'test_data/{file_name}_ouptut.txt', 'w') as f:
    json.dump(result, f)