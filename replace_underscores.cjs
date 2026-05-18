const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let totalReplacements = 0;

walkDir('./src', (file) => {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace text inside JSX tags (e.g. >TEXT_HERE< )
  content = content.replace(/>([^<]+)</g, (match, p1) => {
    if (/[A-ZÁÉÍÓÚÃÕÇ]+_[A-ZÁÉÍÓÚÃÕÇ_]+/.test(p1) && !p1.includes('=')) {
         return '>' + p1.replace(/([A-ZÁÉÍÓÚÃÕÇ0-9])_([A-ZÁÉÍÓÚÃÕÇ0-9])/g, '$1 $2').replace(/([A-ZÁÉÍÓÚÃÕÇ0-9])_([A-ZÁÉÍÓÚÃÕÇ0-9])/g, '$1 $2') + '<';
    }
    return match;
  });

  // Replace in placeholder="SOMETHING_HERE"
  content = content.replace(/placeholder="([^"]+)"/g, (match, p1) => {
    return 'placeholder="' + p1.replace(/_/g, ' ') + '"';
  });

  // Replace in label: 'SOMETHING_HERE'
  content = content.replace(/label:\s*'([^']+)'/g, (match, p1) => {
     if (/[A-ZÁÉÍÓÚÃÕÇ]+_[A-ZÁÉÍÓÚÃÕÇ]+/.test(p1)) {
        return `label: '${p1.replace(/_/g, ' ')}'`;
     }
     return match;
  });

  // Replace title="SOMETHING_HERE"
  content = content.replace(/title="([^"]+)"/g, (match, p1) => {
     if (/[A-ZÁÉÍÓÚÃÕÇ]+_[A-ZÁÉÍÓÚÃÕÇ]+/.test(p1)) {
        return `title="${p1.replace(/_/g, ' ')}"`;
     }
     return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
  }
});

console.log(`Replaced underscores in ${totalReplacements} files.`);
