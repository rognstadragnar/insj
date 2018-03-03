const inquirer = require('inquirer')

function getPrompt(value, choices) {
  if (typeof value === 'object') {
    const prompt = {
      name: value.name || value.value,
      message: `Enter a ${value.value}:`,
      type: value.choices || choices ? 'list' : 'input'
    }
    if (value.choices || choices) prompt.choices = value.choices || choices

    return prompt
  } else if (Array.isArray(choices)) {
    return {
      name: value.name || value,
      message: `Enter a ${value.value}:`,
      type: 'choices',
      choices: value.choices || choices || []
    }
  }

  return {
    name: value,
    message: `Enter a ${value}:`,
    type: 'input'
  }
}

async function prompt(prompts) {
  if (!Array.isArray(prompts)) prompts = [prompts]
  return await inquirer.prompt(prompts.map(getPrompt))
}

module.exports = {
  prompt
}
