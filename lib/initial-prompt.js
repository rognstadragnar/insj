// const chalk = require('chalk');
const { runPrompt } = require('./prompts/');

// const { choose, input, yesNo } = require('./prompt/');

async function initialPrompt(opts, choices) {
  console.log('i get called');
  let pathToRepo = opts.repo;
  let pathToDestination = opts.dest;
  let isNewRepo = false;
  let newTemplateName = '';
  // const templates = choices.filter(choice => choice.value !== 'custom');

  const questions = [
    {
      type: () => (pathToRepo ? null : 'select'),
      name: 'fromTemplateOrCustom',
      message: 'Choose a template (or a custom repository):',
      choices: choices.map(({ name, value }) => ({ title: name, value })),
    },
    {
      type: 'text',
      shouldAsk: values => values.fromTemplateOrCustom === 'custom',
      name: 'pathToRepo',
      message: 'Enter path to repository',
      validation: res => Boolean(res),
      errorMessage: 'Path to repository can not be empty',
    },
    {
      type: 'text',
      name: 'pathToDestination',
      message: 'Enter destination folder name',
      shouldAsk: () => pathToDestination !== 'custom',
    },
    {
      type: 'confirm',
      shouldAsk: values => !values.pathToDestination,
      name: 'confirmUseCurrent',
      message: 'Are you sure you want to use the current folder?',
    },
  ];

  const res = await runPrompt(questions);
  console.log(res);

  if (res.fromTemplateOrCustom === 'custom') {
    pathToRepo = res.pathToRepo; // eslint-disable-line prefer-destructuring
    isNewRepo = true;
    if (res.shouldAsk) {
      newTemplateName = res.templateName;
    }
  } else {
    pathToRepo = res.fromTemplateOrCustom;
  }

  if (!pathToDestination) {
    if (res.pathToDestination === '') {
      if (res.confirmUseCurrent) {
        pathToDestination = '';
      } else {
        throw new Error('Aborting...');
      }
    } else {
      pathToDestination = res.pathToDestination; // eslint-disable-line prefer-destructuring
    }
  }

  return {
    pathToRepo,
    pathToDestination,
    isNewRepo,
    newTemplateName,
  };
}

module.exports = {
  initialPrompt,
};
