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

const pagesDir = path.join(__dirname, 'resources', 'js', 'pages', 'petugas');

walkDir(pagesDir, function(file) {
    if (file.endsWith('Index.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove dynamic window.location.pathname
        content = content.replace(
            /href:\s*window\.location\.pathname/g,
            "href: '#'" // safe fallback
        );
        fs.writeFileSync(file, content);
        console.log(`Fixed breadcrumb window.location for ${file}`);
    }
});
