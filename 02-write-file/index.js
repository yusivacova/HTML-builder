const fs = require('fs');
const output = fs.createWriteStream('./02-write-file/text.txt');

const { stdin, stdout, exit } = process;

stdout.write('Введите любой текст:\n');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit'){
        goodbye();
    }
    output.write(data);
});

process.on('SIGINT', goodbye);

function goodbye () {
    stdout.write('\n\nСпасибо и прощай!');
    exit();
}