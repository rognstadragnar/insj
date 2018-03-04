const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const { promisify } = require('util');
const { retryablePrompt } = require('./prompt');
const Listr = require('listr');

async function writeNewTemplates(name, templates, config, path) {
  const newConfig = Object.assign(config, { templates });
  const writeAsync = promisify(fs.writeFile);
  const task = new Listr([
    {
      title: `Adding '${name}' to templates`,
      task: async (ctx, taskInstance) => {
        await writeAsync(path, JSON.stringify(newConfig, null, 2))
          .then(() => {
            // eslint-disable-next-line no-param-reassign
            taskInstance.title = `Added '${name}' to templates`;
          })
          .catch(() => {
            // eslint-disable-next-line no-param-reassign
            taskInstance.title = `Failed to add '${name} to templates`;
          });
      },
    },
  ]);

  return task.run().catch(console.error);
}

async function addTemplate(name, config, path) {
  const newRepo = {
    name: name !== true ? name : null,
  };
  if (!newRepo.name) {
    newRepo.name = await retryablePrompt(
      [
        {
          name: 'value',
          message: 'Enter a name for the template:',
          type: 'input',
        },
      ],
      '\n',
      chalk.yellow('Warning:'),
      'Name cannot be empty.',
    );
  }

  newRepo.value = await retryablePrompt(
    [
      {
        name: 'value',
        message: 'Enter path to the repository:',
        type: 'input',
      },
    ],
    '\n',
    chalk.yellow('Warning:'),
    'Path cannot be empty.',
  );
  newRepo.isDefault = await inquirer
    .prompt([
      {
        name: 'isDefault',
        message: 'Set as default template?',
        type: 'confirm',
      },
    ])
    .then(res => res.isDefault);

  if (newRepo.isDefault) {
    const newTemplates = config.templates
      .slice()
      .map(template => Object.assign(template, { isDefault: false }));
    newTemplates.push(newRepo);

    await writeNewTemplates(newRepo.name, newTemplates, config, path);
  } else {
    const newTemplates = config.templates.slice();
    newTemplates.push(newRepo);
    await writeNewTemplates(newRepo.name, newTemplates, config, path);
  }
}

module.exports = {
  addTemplate,
};
