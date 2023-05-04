const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const filesNameMain = [];

function createFolders() {
    const pathFolder = path.join(__dirname, 'project-dist');
    fs.mkdir(pathFolder, {
        recursive: true
    }, err => {
        if (err) {
            return console.error(err.message);
        }
    })

    const pathFolderAssets = path.join(__dirname, './project-dist', '/assets');
    fs.mkdir(pathFolderAssets, {
        recursive: true
    }, err => {
        if (err) {
            return console.error(err.message);
        }
    })
}

function copyDir(myAssets) {
    fsPromises.readdir((path.join(__dirname, myAssets)), {
        withFileTypes: true,
    }).then(files => {
        files.forEach(file => {
            const filePath = path.join(__dirname, myAssets, file.name);
            const fileName = path.basename(filePath);

            const pathNewFolder = path.join(__dirname, './project-dist', `/${myAssets}`, `/${fileName}`);
            if (!file.isDirectory()) {
                filesNameMain.push(fileName);

                fs.copyFile(filePath, path.join(__dirname, './project-dist', `/${myAssets}`, fileName), (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                })
            } else {
                fs.mkdir(pathNewFolder, {
                    recursive: true
                }, err => {
                    if (err) {
                        return console.error(err.message);
                    }
                })
                copyDir(`assets/${fileName}`);
            }
        })

        console.log('Done');
    });

}

function updateFiles(myAssets) {
    fsPromises.readdir((path.join(__dirname, './project-dist', `/${myAssets}`)), {
        withFileTypes: true,
    }).then(files => {
        files.forEach(file => {
            const filePath = path.join(__dirname, './project-dist', `/${myAssets}`, file.name);
            const fileName = path.basename(filePath);
            if (!file.isDirectory()) {
                if (!filesNameMain.includes(fileName)) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            return console.error(err.message);
                        }
                    })
                }
            } else {
                updateFiles(`assets/${fileName}`);
            }
        })
    });
}

createFolders();
copyDir('assets');
updateFiles('assets');

//СДЕЛАТЬ:
//----СОЕДИТЬ СТИЛИ
//----СОЕДИНИТЬ Html