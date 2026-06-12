import os
import re

base_dir = r"c:\Users\User\Desktop\Cording\DMY_SC\DMY-SC-main"

def adjust_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    modified = False

    # Replace blur values (8px or 10px -> 4px)
    new_content = re.sub(r"blur\((8|10)px\)", "blur(4px)", content)
    if new_content != content:
        content = new_content
        modified = True

    # Replace background opacity (rgba(10, 21, 15, 0.6) or 0.7 or 0.8 -> 0.45)
    new_content = re.sub(r"rgba\(10,\s*21,\s*15,\s*0\.(6|7|8)\)", "rgba(10, 21, 15, 0.45)", content)
    if new_content != content:
        content = new_content
        modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Adjusted blur & overlay in: {file_path}")

# Walk directories and files
for root, dirs, files in os.walk(base_dir):
    if any(p in root for p in ['.git', 'node_modules', '.gemini']):
        continue
    for file in files:
        if file.endswith((".html", ".css")):
            adjust_file(os.path.join(root, file))
