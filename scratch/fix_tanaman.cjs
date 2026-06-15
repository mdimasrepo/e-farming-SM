const fs = require('fs');

let apiContent = fs.readFileSync('src/utils/api.js', 'utf8');
if (!apiContent.includes('export const getImageUrl')) {
  apiContent += `\nexport const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  const baseUrl = API_BASE.replace(/\\/api$/, '');
  return \`\${baseUrl}\${url.startsWith('/') ? '' : '/'}\${url}\`;
};\n`;
  fs.writeFileSync('src/utils/api.js', apiContent);
  console.log('Updated api.js');
}

const targetFiles = ['src/pages/DataTanaman.jsx', 'src/pages/ManajemenLahan.jsx'];

for (const file of targetFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('getImageUrl')) {
    content = content.replace(/import \{ ([^}]+) \} from '\.\.\/utils\/api';/, "import { $1, getImageUrl } from '../utils/api';");
  }

  if (file.includes('DataTanaman')) {
    content = content.replace(/<img src=\{crop\.imageUrl\}/g, '<img src={getImageUrl(crop.imageUrl)}');
    content = content.replace(/<img src=\{form\.imageUrl\}/g, '<img src={getImageUrl(form.imageUrl)}');
  }
  
  if (file.includes('ManajemenLahan')) {
    // Regex is tricky here, so let's just do a string replace for the exact code
    const oldBgStr = "`url(${land.imageUrl.startsWith('data:') ? land.imageUrl : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}${land.imageUrl}`})`";
    const newBgStr = "`url(${getImageUrl(land.imageUrl)})`";
    content = content.replace(oldBgStr, newBgStr);

    const oldImgStr = "<img src={form.imageUrl.startsWith('data:') ? form.imageUrl : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')}${form.imageUrl}`}";
    const newImgStr = "<img src={getImageUrl(form.imageUrl)}";
    content = content.replace(oldImgStr, newImgStr);
  }

  fs.writeFileSync(file, content);
  console.log('Updated', file);
}
