const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const filesNameMain = [];

function createFolders(folder) {
    const pathFolder = path.join(__dirname, folder);
    fs.mkdir(pathFolder, {
        recursive: true
    }, err => {
        if (err) {
            return console.error(err.message);
        }
    })
}

function copyDir(myAssets) {
    createFolders('./project-dist/assets');

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

function glueStyleCssFile() {
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

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
        })
    })
}

function glueHTMLPage(obj) {
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    let arrContentTemplateFile = [];
    const templatePath = path.join(__dirname, 'template.html');
    const input = fs.createReadStream(templatePath, 'utf-8');

    input.on('data', chunk => {
        arrContentTemplateFile.push(chunk)
        let partsContentTemplateFile = arrContentTemplateFile[0].split('\n');
        partsContentTemplateFile.forEach((line, index) => {
            if (line.includes('{{') && line.includes('}}')) {
                let check = line.split('}}');
                let counter = 0;
                for (let i = 0; i < check.length; i++) {
                    if (check[i] !== '') {
                        let nameFileComponents = check[i].trim().slice(2);
                        if (!counter) {
                            partsContentTemplateFile[index] = obj[nameFileComponents];
                            counter++;
                        } else {
                            partsContentTemplateFile.splice(index + 1, 0, `{{${nameFileComponents}}}`);
                        }
                    }
                }
            }
        });
        output.write(partsContentTemplateFile.join('\n'));
    });
}

function buildIndexHtmlFile() {
    let objContentComponentsHTML = {};

    fsPromises.readdir((path.join(__dirname, 'components')), {
        withFileTypes: true,
    }).then(files => {
        files.forEach(file => {
            const filePath = path.join(__dirname, 'components', file.name);
            const fileName = path.basename(filePath);
            const fileExt = path.extname(filePath);
            if (fileExt === '.html') {
                const input = fs.createReadStream(filePath, 'utf-8');
                input.on('data', chunk => {
                    objContentComponentsHTML[fileName.slice(0, -5)] = chunk;
                });
            }
        })
        glueHTMLPage(objContentComponentsHTML);
    });
}

createFolders('project-dist');
copyDir('assets');
updateFiles('assets');
glueStyleCssFile();
buildIndexHtmlFile();