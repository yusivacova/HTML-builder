const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

fsPromises.readdir((path.join(__dirname, 'secret-folder')),{
    withFileTypes: true,
    }).then(files => {
        files.forEach(file => {
            if (!file.isDirectory()){
                const filePath = path.join(__dirname, 'secret-folder', file.name);
                const fileName = path.basename(filePath);
                fsPromises
                .stat(filePath)
                .then(infoFile =>{
                    let result = fileName.split('.').join(' - ');
                    console.log(`${result} - ${infoFile.size}`);
                })
            }
        })
    });