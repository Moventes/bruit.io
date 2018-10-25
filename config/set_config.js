const fs = require('fs');

console.log('Initializing config...');
const env = process.argv[process.argv.length - 1];
console.log(`will set conf to : ${env}`);

const read = fs.createReadStream(`config/${env}/config.ts`);
read.on('error', err => console.error(err));

const write = fs.createWriteStream('src/config/config.ts');
write.on('error', err => console.error(err));
write.on('close', result => console.log('done'));

read.pipe(write);

