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
    if (file.endsWith('Show.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Fix permohonan.kode_tiket inside the Show.layout definition
        if (content.includes('{ title: `Detail ${permohonan.kode_tiket}`')) {
            content = content.replace(
                /{ title: `Detail \${permohonan\.kode_tiket}`/g, 
                "{ title: `Detail ${page.props.permohonan?.kode_tiket || ''}`"
            );
            fs.writeFileSync(file, content);
            console.log(`Fixed ReferenceError for ${file}`);
        }
    }
});
