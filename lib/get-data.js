const { prompt } = require('./prompt');
const chalk = require('chalk');

async function getData(config) {
  try {
    const { properties = [] } = config;
    if (!properties || properties.length <= 0) {
      return {};
    }
    console.log('\nTemplate wants following properties:');
    properties.forEach(property => {
      console.log(`  ${chalk.yellow('–')} ${property}`);
    });
    console.log();
    const userInput = await prompt(properties);
    const data = properties.reduce((pv, cv) => Object.assign(pv, { [cv]: userInput[cv] }), {});
    return data;
  } catch (err) {
    console.error('error in get data', config, err);
    return err;
  }
}

module.exports = { getData };
