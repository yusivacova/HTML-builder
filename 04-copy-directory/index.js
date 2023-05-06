const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const filesNameMain = [];

function copyDir() {
  const pathFolder = path.join(__dirname, 'files-copy');
  fs.mkdir(pathFolder, {
    recursive: true
  }, err => {
    if (err) {
      return console.error(err.message);
    }
  });

  fsPromises.readdir((path.join(__dirname, 'files')), {
    withFileTypes: true,
  }).then(files => {
    files.forEach(file => {
      const filePath = path.join(__dirname, 'files', file.name);
      const fileName = path.basename(filePath);
      filesNameMain.push(fileName);

      fs.copyFile(filePath, path.join(__dirname, 'files-copy', fileName), (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
    console.log('Done');
  });
}

function updateFiles() {
  fsPromises.readdir((path.join(__dirname, 'files-copy')), {
    withFileTypes: true,
  }).then(files => {
    files.forEach(file => {
      const filePath = path.join(__dirname, 'files-copy', file.name);
      const fileName = path.basename(filePath);

      if (!filesNameMain.includes(fileName)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
  });
}

copyDir();
updateFiles();


