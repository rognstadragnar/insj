const inquirer = require('inquirer');

function getPrompt(value, choices) {
  if (typeof value === 'object') {
    const currentPrompt = {
      name: value.name || value.value,
      message: `Enter a ${value.value}:`,
      type: value.choices || choices ? 'list' : 'input',
    };
    if (value.choices || choices) currentPrompt.choices = value.choices || choices;

    return currentPrompt;
  } else if (Array.isArray(choices)) {
    return {
      name: value.name || value,
      message: `Enter a ${value.value}:`,
      type: 'choices',
      choices: value.choices || choices || [],
    };
  }

  return {
    name: value,
    message: `Enter a ${value}:`,
    type: 'input',
  };
}

async function prompt(prompts) {
  const currentPrompt = !Array.isArray(prompts) ? [prompts] : prompts;
  return inquirer.prompt(currentPrompt.map(getPrompt));
}

async function retryablePrompt(currentPrompt, ...message) {
  const res = await inquirer.prompt(currentPrompt);
  if (Object.keys(res).filter(key => res[key]).length === 0) {
    console.log(...message);
    return retryablePrompt(currentPrompt, ...message);
  }
  return res.value;
}

module.exports = {
  prompt,
  retryablePrompt,
};
