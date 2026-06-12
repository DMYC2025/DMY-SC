import os
import re

# Directories to search
dirs = ["admin", "auth"]
base_dir = r"c:\Users\User\Desktop\Cording\DMY_SC\DMY-SC-main"

def refactor_html(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    modified = False

    # 1. Update tailwind.config colors
    # Replace background color in tailwind config
    # Example: background: '#121212' -> background: '#0a150f'
    new_content, count1 = re.subn(
        r"background:\s*['\"]#121212['\"]",
        "background: '#0a150f'",
        content
    )
    if count1 > 0:
        modified = True
        print(f"  Replaced {count1} background color definitions to #0a150f")
        content = new_content

    # Replace primary color in tailwind config
    # Example: primary: '#a8c7fa' or '#a6f7bd' -> primary: '#1ED760'
    new_content, count2 = re.subn(
        r"primary:\s*['\"]#(a8c7fa|a6f7bd)['\"]",
        "primary: '#1ED760'",
        content
    )
    if count2 > 0:
        modified = True
        print(f"  Replaced {count2} primary color definitions to #1ED760")
        content = new_content

    # Replace on-primary color in tailwind config
    # Example: 'on-primary': '#062e6f' -> 'on-primary': '#003915'
    new_content, count3 = re.subn(
        r"['\"]on-primary['\"]:\s*['\"]#062e6f['\"]",
        "'on-primary': '#003915'",
        content
    )
    if count3 > 0:
        modified = True
        print(f"  Replaced {count3} on-primary color definitions to #003915")
        content = new_content

    # Check if there are other hardcoded background colors like bg-[#121212] or text-[#a8c7fa] in tailwind classes
    # Let's replace:
    # bg-[#121212] -> bg-[#0a150f]
    # text-[#a8c7fa] or text-[#a6f7bd] -> text-[#1ED760]
    # border-[#a8c7fa] or border-[#a6f7bd] -> border-[#1ED760]
    new_content, count4 = re.subn(
        r"bg-\[#121212\]",
        "bg-[#0a150f]",
        content
    )
    if count4 > 0:
        modified = True
        print(f"  Replaced {count4} bg-[#121212] class references")
        content = new_content

    new_content, count5 = re.subn(
        r"(text|border|hover:border|focus:border|hover:text|focus:text|bg|hover:bg|focus:bg|accent|outline)-\[#(a8c7fa|a6f7bd)\]",
        r"\1-[#1ED760]",
        content
    )
    if count5 > 0:
        modified = True
        print(f"  Replaced {count5} color class references to #1ED760")
        content = new_content

    # 2. Inject font stylesheet if not present in the head section
    if "fonts.googleapis.com" not in content and "</head>" in content:
        font_link = '    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">\n'
        content = content.replace("</head>", font_link + "   </head>")
        modified = True
        print("  Injected Outfit & Roboto Google Font Link")

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  Successfully wrote changes to {file_path}")
    else:
        print("  No changes needed.")

# Walk through directories
for d in dirs:
    dir_path = os.path.join(base_dir, d)
    if not os.path.isdir(dir_path):
        continue
    for file in os.listdir(dir_path):
        if file.endswith(".html"):
            refactor_html(os.path.join(dir_path, file))
