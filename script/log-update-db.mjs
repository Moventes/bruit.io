import chalk from 'chalk';
const log = console.log;

log('          ' + chalk.yellow.underline('                                                 '));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow('|       ') + chalk.bold.bgRedBright('/!\\ UPDATE VERSION IN DATABASE /!\\') + chalk.yellow('      |'));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow('|                    ') + chalk.bold.bgRedBright(process.env.npm_package_version) + chalk.yellow('                      |'));
log('          ' + chalk.yellow('|                                               |'));
log('          ' + chalk.yellow.underline('                                                 '));
