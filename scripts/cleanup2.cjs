const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') return;
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const files = walk(process.cwd());
files.forEach((f) => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('<<<<<<< HEAD')) {
      let out = '';
      let lines = content.split(/\r?\n/);
      let mode = 0;
      for (let line of lines) {
        if (line === '<<<<<<< HEAD') { mode = 1; continue; }
        if (line === '=======') { mode = 2; continue; }
        if (line.startsWith('>>>>>>>')) { mode = 0; continue; }
        if (mode !== 2) out += line + '\n';
      }
      fs.writeFileSync(f, out);
      console.log('cleaned', f);
    }
  } catch (e) {
    console.error('fail', f, e);
  }
});
