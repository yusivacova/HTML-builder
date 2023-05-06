const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

function glueStyleCssFile() {
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

  fsPromises.readdir((path.join(__dirname, 'styles')), {
    withFileTypes: true,
  }).then(files => {
    files.forEach(file => {
      const filePath = path.join(__dirname, 'styles', file.name);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const input = fs.createReadStream(filePath, 'utf-8');
        input.on('data', chunk => output.write(chunk));
      }
    });
  });
}

glueStyleCssFile();