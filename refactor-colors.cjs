const fs = require('fs');
const path = require('path');

const directories = [
    'resources/js/Pages/Admin',
    'resources/js/pages'
];

const replacements = [
    { from: /bg-\[\#f8fafc\]/g, to: 'bg-background' },
    { from: /bg-white/g, to: 'bg-card' }, // We'll manually check this, but generally okay if it's not on a Card. If on a Card, it's redundant but harmless since card has bg-card. Actually, wait! bg-card works correctly. 
    // Wait, let's just remove bg-white if it's right after Card className="
    { from: /Card className="([^"]*)bg-white([^"]*)"/g, to: 'Card className="$1$2"' },
    { from: /bg-white/g, to: 'bg-background' }, // For remaining bg-white that aren't on Card (e.g. dropdowns or inputs)
    { from: /border-slate-200\/50/g, to: 'border-border/50' },
    { from: /border-slate-200/g, to: 'border-border' },
    { from: /border-slate-100/g, to: 'border-border' },
    { from: /text-slate-900/g, to: 'text-foreground' },
    { from: /text-slate-800/g, to: 'text-foreground' },
    { from: /text-slate-700/g, to: 'text-foreground/80' },
    { from: /text-slate-600/g, to: 'text-muted-foreground' },
    { from: /text-slate-500/g, to: 'text-muted-foreground' },
    { from: /text-slate-400/g, to: 'text-muted-foreground/70' },
    { from: /text-slate-300/g, to: 'text-muted-foreground/50' },
    { from: /bg-slate-50/g, to: 'bg-muted/50' },
    { from: /bg-slate-100/g, to: 'bg-muted' },
    { from: /bg-slate-200/g, to: 'bg-muted/80' },
    { from: /hover:bg-slate-50/g, to: 'hover:bg-muted/50' },
    { from: /hover:bg-slate-100/g, to: 'hover:bg-muted' },
    { from: /hover:text-slate-700/g, to: 'hover:text-foreground' },
    { from: /hover:text-slate-900/g, to: 'hover:text-foreground' },
    { from: /hover:shadow-md/g, to: 'hover:shadow-md dark:hover:shadow-none' }, // Shadows can be weird in dark mode
    { from: /shadow-sm/g, to: 'shadow-sm dark:shadow-none' },
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Special pre-processing
    // Sometimes there is bg-white inside className="... bg-white ..."
    content = content.replace(/className="([^"]*)bg-white([^"]*)"/g, (match, p1, p2) => {
        // If it's a Card, we want to remove bg-white. But since we don't know the element here, we just replace it with bg-card
        return `className="${p1}bg-card${p2}"`;
    });

    for (const rule of replacements) {
        content = content.replace(rule.from, rule.to);
    }
    
    // Cleanup double spaces
    content = content.replace(/className="([^"]+)"/g, (match, p1) => {
        return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

for (const dir of directories) {
    walkDir(dir);
}

console.log('Done.');
