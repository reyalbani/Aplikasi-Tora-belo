import re

with open('resources/js/pages/layanan/ppid.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("UU No. 14 / 2008", "LAYANAN INFORMASI PUBLIK")

with open('resources/js/pages/layanan/ppid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated badge in ppid.tsx")
