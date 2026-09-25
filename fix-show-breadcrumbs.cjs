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
        
        // Remove dynamic breadcrumb title which causes Cannot read properties of undefined
        content = content.replace(
            /\{ title: `Detail \$\{page\.props\?\.permohonan\?\.kode_tiket \|\| ''\}`([^}]*)\}/g,
            "{ title: 'Detail Permohonan'$1}"
        );
        content = content.replace(
            /\{ title: `Detail \$\{page\.props\.permohonan\?\.kode_tiket \|\| ''\}`([^}]*)\}/g,
            "{ title: 'Detail Permohonan'$1}"
        );
        content = content.replace(
            /\{ title: `Detail \$\{permohonan\.kode_tiket\}`([^}]*)\}/g,
            "{ title: 'Detail Permohonan'$1}"
        );

        fs.writeFileSync(file, content);
        console.log(`Fixed breadcrumb for ${file}`);
    }
});
