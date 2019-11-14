const fs = require('fs');
const package = require("./../package");
const editJsonFile = require("edit-json-file");


console.log('Initializing config...');
const env = process.argv[process.argv.length - 1];


console.log(`will update env files`);

var envFileProd = editJsonFile(`src/environments/config.prod.json`, {
    autosave: true
});
var envFileDev = editJsonFile(`src/environments/config.dev.json`, {
    autosave: true
});

envFileProd.set('version', package.version);
envFileDev.set('version', package.version);



console.log(`will set conf to : ${env}`);

const read = fs.createReadStream(`src/environments/config.${env}.json`);
read.on('error', err => console.error(err));

const write = fs.createWriteStream('src/config/config.json');
write.on('error', err => console.error(err));
write.on('close', result => console.log('done'));

read.pipe(write);

