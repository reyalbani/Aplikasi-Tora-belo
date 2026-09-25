const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const pagesDir = path.join(__dirname, 'resources', 'js', 'pages', 'settings');

walkDir(pagesDir, function(file) {
    if (file.endsWith('.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        
        const layoutRegex = /<AppLayout\s+breadcrumbs={(\[[\s\S]*?\])}>/;
        const match = content.match(layoutRegex);
        
        if (match) {
            const breadcrumbs = match[1];
            content = content.replace(layoutRegex, '<>');
            content = content.replace(/<\/AppLayout>/, '</>');
            
            if (!content.includes("import AppLayout")) {
                 content = `import AppLayout from '@/layouts/app-layout';\n` + content;
            }

            const componentName = path.basename(file, '.tsx');
            content += `\n${componentName}.layout = (page: any) => <AppLayout breadcrumbs={${breadcrumbs}}>{page}</AppLayout>;\n`;
            
            fs.writeFileSync(file, content);
            console.log(`Fixed layout for ${file}`);
        }
    }
});
