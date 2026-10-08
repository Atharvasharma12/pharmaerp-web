const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const dirFiles = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  dirFiles.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('c:/Users/Intel/Desktop/erp/erp-frontend/src/features/operations');

const replacements = [
  { from: /text-emerald-[4-9]00(?: dark:text-emerald-[4-9]00)?/g, to: 'text-success' },
  { from: /text-emerald-[1-3]00(?: dark:text-emerald-[1-3]00)?/g, to: 'text-success/70' },
  { from: /bg-emerald-50(?: dark:bg-emerald-500\/10)?/g, to: 'bg-success-soft' },
  { from: /bg-emerald-100(?: dark:bg-emerald-500\/20)?/g, to: 'bg-success-soft' },
  { from: /border-emerald-[2-3]00(?: dark:border-emerald-[5-6]00\/\d0)?/g, to: 'border-success/30' },
  
  { from: /text-amber-[4-9]00(?: dark:text-amber-[3-9]00)?/g, to: 'text-warning' },
  { from: /text-amber-[1-3]00(?: dark:text-amber-[1-3]00)?/g, to: 'text-warning/70' },
  { from: /bg-amber-50(?: dark:bg-amber-500\/10)?/g, to: 'bg-warning-soft' },
  { from: /bg-amber-100(?: dark:bg-amber-500\/20)?/g, to: 'bg-warning-soft' },
  { from: /border-amber-[2-3]00(?: dark:border-amber-[5-6]00\/\d0)?/g, to: 'border-warning/30' },
  { from: /bg-warning-soft\/60(?: dark:bg-warning-soft0\/5)?/g, to: 'bg-warning-soft' },
  
  { from: /text-blue-[4-9]00(?: dark:text-blue-[4-9]00)?/g, to: 'text-info' },
  { from: /bg-blue-50(?: dark:bg-blue-500\/10)?/g, to: 'bg-info-soft' },
  { from: /border-blue-[2-3]00(?: dark:border-blue-500\/30)?/g, to: 'border-info/30' },
  { from: /border-blue-400(?: dark:border-blue-500)?/g, to: 'border-info' },
  
  { from: /bg-red-50(?: dark:bg-red-500\/10)?/g, to: 'bg-error-soft' },
  { from: /text-red-[4-9]00(?: dark:text-red-[4-9]00)?/g, to: 'text-error' },
  { from: /bg-red-100(?: dark:bg-red-500\/20)?/g, to: 'bg-error-soft' },
  { from: /border-red-[2-3]00(?: dark:border-red-500\/30)?/g, to: 'border-error/30' },
  
  // also catch plain dark variations if they exist separately
  { from: /dark:text-emerald-[3-6]00/g, to: 'text-success' },
  { from: /dark:text-amber-[3-6]00/g, to: 'text-warning' },
  { from: /dark:text-blue-[3-6]00/g, to: 'text-info' },
  { from: /dark:border-amber-500\/25/g, to: 'border-warning/30' },
  { from: /dark:border-emerald-500\/25/g, to: 'border-success/30' },
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const r of replacements) {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
