const fs = require('fs');
const glob = require('glob');

glob('**/*.*', { dot: true, ignore: ['node_modules/**', '.git/**'] }, (err, files) => {
  if (err) return console.error(err);
  files.forEach((f) => {
    try {
      let content = fs.readFileSync(f, 'utf8');
      if (content.includes('<<<<<<< HEAD')) {
        let out = '';
        let lines = content.split(/\r?\n/);
        let mode = 0;
        for (let line of lines) {
          if (line === '<<<<<<< HEAD') {
            mode = 1;
            continue;
          }
          if (line === '=======') {
            mode = 2;
            continue;
          }
          if (line.startsWith('>>>>>>>')) {
            mode = 0;
            continue;
          }
          if (mode !== 2) out += line + '\n';
        }
        fs.writeFileSync(f, out);
        console.log('cleaned', f);
      }
    } catch (e) {
      console.error('fail', f, e);
    }
  });
});

