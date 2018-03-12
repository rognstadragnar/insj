const chalk = require('chalk');
// const { input, yesNo, choose } = require('./prompt/');
const { runPrompt } = require('./prompts/');

/* const getPrompt = async promptObj => {
  if (typeof promptObj === 'string') {
    return input({ message: promptObj, type: 'input' });
  }
  const {
    choices, message, errorMessage, type, validations, required,
  } = promptObj;

  if (choices) {
    return choose({
      message,
      choices,
      errorMessage,
    });
  } else if (type === 'confirm') {
    return yesNo({ message, errorMessage });
  }
  return input({
    message,
    errorMessage,
    validations,
    required,
  });
};

async function runAllPrompts(properties = []) {
  const data = {};
  for (const property of properties) {
    console.log(property);
    const key = typeof property === 'string' ? property : property.name;
    data[key] = await getPrompt(property);
  }

  return data;
} */

async function getData(config) {
  try {
    const { properties = [] } = config;
    if (!properties || properties.length <= 0) {
      return {};
    }
    console.log('\nTemplate wants following properties:');
    properties.forEach(property => {
      console.log(`  ${chalk.yellow('–')} ${property.name}`);
    });
    console.log();
    // const userInput = await prompt(properties);

    const data = await runPrompt(properties);
    /*
    const props = properties;
    props.unshift({ name: 'name', choices: ['1', '2'], message: 'Testing' });
    const userInput = await runAllPrompts(props);
    const data = properties.reduce((pv, cv) => Object.assign(pv, { [cv]: userInput[cv] }), {});
    */

    console.log(data);

    return data;
  } catch (err) {
    console.error('error in get data', config, err);
    return err;
  }
}

module.exports = { getData /* getPrompt */ };
