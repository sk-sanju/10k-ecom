const fs = require('fs');
const path = require('path');

const dirsToSearch = ['assets/js', '.', 'policies'];
const extensions = ['.html', '.js'];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && dirsToSearch.includes(file)) {
             processDir(fullPath);
        } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content
                .replace(/Kavish/g, 'Kavish')
                .replace(/Kavish/g, 'Kavish')
                .replace(/Kavish/gi, 'Kavish')
                .replace(/Kavish/gi, 'Kavish')
                .replace(/Kavish/gi, 'Kavish')
                .replace(/Tradition Woven<br>\s*<span class="fst-italic text-primary">in Every Thread<\/span>/gi, 'Dress with<br>\n            <span class="fst-italic text-primary">Heritage</span>');
            
            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    }
}

dirsToSearch.forEach(processDir);
console.log('Replacement complete.');
