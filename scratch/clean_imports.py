import os
import re

files = [
    "resources/js/pages/layanan/ppid.tsx",
    "resources/js/pages/layanan/pengaduan-masyarakat.tsx",
    "resources/js/pages/layanan/pendidikan-pemilih.tsx",
    "resources/js/pages/layanan/kerjasama.tsx",
    "resources/js/pages/layanan/show.tsx"
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all import statements from 'lucide-react'
    pattern = re.compile(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];')
    matches = pattern.findall(content)

    if not matches:
        continue

    # Extract all imported symbols
    symbols = set()
    for match in matches:
        for symbol in match.split(','):
            sym = symbol.strip()
            if sym:
                symbols.add(sym)

    # Make a clean import statement
    symbols_list = sorted(list(symbols))
    new_import = "import { " + ", ".join(symbols_list) + " } from 'lucide-react';"

    # Replace all existing lucide-react imports with empty string
    content = pattern.sub('', content)

    # Insert the new import right after the first import
    first_import_idx = content.find('import ')
    end_of_first_import = content.find(';', first_import_idx) + 1
    
    if first_import_idx != -1 and end_of_first_import != 0:
        content = content[:end_of_first_import] + "\n" + new_import + content[end_of_first_import:]
    else:
        content = new_import + "\n" + content

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Imports cleaned!")
