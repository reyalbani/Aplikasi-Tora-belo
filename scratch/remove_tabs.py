import re

with open('resources/js/pages/layanan/muparpol.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("showTabs={true}", "showTabs={false}")

with open('resources/js/pages/layanan/muparpol.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
