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

walkDir('./src/pages', (file) => {
  if (!file.endsWith('.tsx')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Reduce 9xl
  content = content.replace(/text-9xl/g, 'text-6xl md:text-9xl');
  // Reduce 8xl
  content = content.replace(/text-8xl/g, 'text-5xl md:text-8xl');
  // Reduce 7xl
  content = content.replace(/text-7xl/g, 'text-4xl md:text-7xl');
  // Reduce 6xl
  content = content.replace(/text-6xl/g, 'text-4xl md:text-6xl');
  // Reduce 5xl
  content = content.replace(/text-5xl/g, 'text-3xl md:text-5xl');
  
  // Clean up duplicate combinations
  content = content.replace(/text-3xl md:text-4xl md:text-5xl/g, 'text-3xl md:text-5xl');
  content = content.replace(/text-4xl md:text-5xl md:text-6xl/g, 'text-4xl md:text-6xl');
  content = content.replace(/text-4xl md:text-4xl md:text-7xl/g, 'text-4xl md:text-7xl');
  content = content.replace(/text-5xl md:text-6xl md:text-8xl/g, 'text-5xl md:text-8xl');
  content = content.replace(/text-6xl md:text-7xl md:text-9xl/g, 'text-6xl md:text-9xl');
  content = content.replace(/md:text-\d+xl md:text-(\d+xl)/g, 'md:text-$1');

  // Fix negative margins/paddings on mobile
  content = content.replace(/ml-20/g, 'ml-0 md:ml-20');
  content = content.replace(/pl-20/g, 'pl-0 md:pl-20');
  content = content.replace(/ml-64/g, 'ml-0 md:ml-64');
  content = content.replace(/p-20/g, 'p-8 md:p-20');
  content = content.replace(/p-16/g, 'p-6 md:p-16');
  content = content.replace(/p-12/g, 'p-6 md:p-12');
  content = content.replace(/px-12/g, 'px-6 md:px-12');
  content = content.replace(/gap-12/g, 'gap-6 md:gap-12');
  content = content.replace(/gap-16/g, 'gap-8 md:gap-16');
  
  // Cleanup duplicates from the padding/margin replacements if they were already there
  content = content.replace(/p-6 md:p-6 md:p-16/g, 'p-6 md:p-16');
  content = content.replace(/p-8 md:p-8 md:p-20/g, 'p-8 md:p-20');

  // Add text-center to common header patterns
  content = content.replace(/className="((?:[^"]*(?:flex-col|space-y-\d+)[^"]*))"/g, (match, p1) => {
    // If it's a flex-col container that might be a header or section
    if (p1.includes('justify-between') || p1.includes('items-start') || p1.includes('h1') || p1.includes('h2') || p1.includes('header')) {
       // but we shouldn't add blindly, just let's add text-center md:text-left
       if (!p1.includes('text-') && p1.includes('space-y-')) {
          return `className="${p1} text-center md:text-left"`;
       }
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
  }
});

console.log(`Replaced typography in ${totalReplacements} files.`);
