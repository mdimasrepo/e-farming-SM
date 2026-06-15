const fs = require('fs');
const path = require('path');

const searchDir = (dir, ext) => {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(searchDir(filePath, ext));
    } else if (filePath.endsWith(ext)) {
      results.push(filePath);
    }
  }
  return results;
};

const files = searchDir('src/pages', '.jsx');

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace \${import.meta.env...} with ${import.meta.env...}
  content = content.replace(/\\\$\{import\.meta\.env/g, '${import.meta.env');
  
  // Replace \${url} with ${url}
  content = content.replace(/\\\$\{url\}/g, '${url}');

  // Replace \${land.imageUrl} with ${land.imageUrl} - just in case any were left
  content = content.replace(/\\\$\{land\.imageUrl\}/g, '${land.imageUrl}');
  
  // Replace \${form.imageUrl} with ${form.imageUrl} - just in case any were left
  content = content.replace(/\\\$\{form\.imageUrl\}/g, '${form.imageUrl}');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed syntax error in', file);
    changedCount++;
  }
}

console.log('Total files fixed:', changedCount);
