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

const files = searchDir('src', '.jsx');

let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replacement string that dynamically grabs VITE_API_URL or defaults to ''
  const dynBase = "`\\${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}";

  // Replace getImageUrl inline functions
  content = content.replace(
    /`http:\/\/localhost:5000\$\{url\}`/g,
    dynBase + "\\${url}`"
  );
  
  content = content.replace(
    /`http:\/\/localhost:5000\$\{land\.imageUrl\}`/g,
    dynBase + "\\${land.imageUrl}`"
  );
  
  content = content.replace(
    /`http:\/\/localhost:5000\$\{form\.imageUrl\}`/g,
    dynBase + "\\${form.imageUrl}`"
  );

  // Replace fetch in Profil.jsx
  content = content.replace(
    /'http:\/\/localhost:5000\/api(.*?)'/g,
    "`\\${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api')}$1`"
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
    changed++;
  }
}
console.log('Total files fixed:', changed);
