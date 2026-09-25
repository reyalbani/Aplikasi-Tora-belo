with open('resources/js/pages/layanan/ppid.tsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

for i in range(len(lines)):
    if '// FORM UI' in lines[i]:
        if '<div className="space-y-6 mt-2">' in lines[i+1]:
            lines[i] = ''
            lines[i+1] = ''
            break

with open('resources/js/pages/layanan/ppid.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
