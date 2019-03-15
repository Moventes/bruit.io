const chalk = require('chalk');
const log = console.log;
const version = require("./../package").version;

log('          ' + chalk.yellow.underline('                                                 '));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow('|       ') + chalk.bold.bgRedBright('/!\\ UPDATE VERSION IN DATABASE /!\\') + chalk.yellow('      |'));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow('|                    ') + chalk.bold.bgRedBright(version) + chalk.yellow('                   |'));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow.underline('                                                 '));
