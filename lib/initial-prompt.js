const inquirer = require('inquirer');
const chalk = require('chalk');
const { retryablePrompt } = require('./prompt.js');

async function initialPrompt(opts, choices) {
  let pathToRepo = opts.repo;
  let pathToDestination = opts.dest;
  let isNewRepo = false;
  const templates = choices.filter(choice => choice.value !== 'custom');

  if (!pathToRepo) {
    if (templates.length === 0) {
      pathToRepo = 'custom';
    } else {
      console.log();
      pathToRepo = await retryablePrompt([
        {
          name: 'value',
          message: 'Choose a template (or a custom repository):',
          type: 'list',
          choices,
        },
      ]);
    }
  }
  if (pathToRepo === 'custom') {
    isNewRepo = true;
    console.log();
    pathToRepo = await retryablePrompt(
      [
        {
          name: 'value',
          message: 'Enter path to repository:',
        },
      ],
      '\n',
      chalk.yellow('Warning:'),
      'Repository path cannot be empty.',
    );
  }
  if (!opts.dest) {
    console.log();
    pathToDestination = await inquirer
      .prompt([
        {
          name: 'value',
          message: 'Enter destination folder name:',
        },
      ])
      .then(res => res.value);
  }
  if (!pathToDestination) {
    console.log();
    console.log(chalk.yellow('Warning:'), 'Path to destination folder is empty');
    console.log('Do you really want to use the current folder?');
    console.log('Continuing may result in overwriting existing files');
    const confirmDestination = await inquirer
      .prompt([
        {
          name: 'confirmDestination',
          message: 'Are you sure you want to continue?',
          type: 'confirm',
        },
      ])
      .then(res => res.confirmDestination);
    if (confirmDestination) {
      console.log(chalk.cyan('    This feature is a TODO'));
    }
    throw Error();
  }
  return { pathToRepo, pathToDestination, isNewRepo };
}

module.exports = {
  initialPrompt,
};
