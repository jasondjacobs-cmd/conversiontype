import{cp,mkdir,rm}from'node:fs/promises';
const files=['index.html','styles.css','app.js','robots.txt','sitemap.xml','site.webmanifest','favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','_headers','_redirects','assets','ratio-calculator'];
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});for(const file of files)await cp(file,`dist/${file}`,{recursive:true});console.log(`Built ${files.length} production entries in dist/`);
