import json
import uuid
from urllib.parse import urlparse

# Open and read the JSON file
file_name = "jimmy"
with open(f"test_data/bookmark_input_{file_name}.json", "r") as file:
    data = json.load(file)

result = []

def fetch_bookmark(obj, path):
    if "url" in obj:
        parsed_url = urlparse(obj["url"])
        domain = parsed_url.netloc
        # result.append(f"{path}:<Id>{uuid.uuid4()}</Id>:<Title>{obj["title"]}</Title>:<Domain>{domain}</Domain>")
        # result.append(f"<Id>{uuid.uuid4()}</Id>:<Title>{obj["title"]}</Title>:<Domain>{domain}</Domain>")
        result.append([path,domain])
        return
    #path_arr = list(filter(str.strip, path.split(":")))
    #path_len = len(path_arr) if path_arr else 0
    #new_path = (f"<RootFolder>{obj["title"]}</RootFolder>" if path_len == 0 else f"{path}:<SubFolder{path_len}>{obj["title"]}</SubFolder{path_len}>") if len(obj["title"]) > 0 else path
    for folder in obj['children']:
        fetch_bookmark(folder, obj["title"])


fetch_bookmark(data[0],"")

output_name = "_folder_name"
with open(f'test_data/bookmark_output_{file_name}{output_name}.json', 'w') as f:
    json.dump(result, f)