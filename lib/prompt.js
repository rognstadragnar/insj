const inquirer = require('inquirer')

function getPrompt(value, choises) {
  if (typeof value === 'object') {
    return {
      name: value.value,
      message: `Enter a ${value.value}:`,
      type: 'choises',
      choises: value.choises
    }
  }
  return {
    name: value,
    message: `Enter a ${value}:`,
    type: 'input'
  }
}

async function prompt(values) {
  const inquiry = await inquirer.prompt(values.map(getPrompt))
  return inquiry
}

module.exports = {
  prompt
}
