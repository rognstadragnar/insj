const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const getGitUserInfo = async () => ({
  name: await exec('git config user.name').then(({ stdout }) => stdout.split('\n')[0]),
  email: await exec('git config user.email').then(({ stdout }) => stdout.split('\n')[0]),
});

const exampleConfig = ({ userInfo }, chalk) => ({
  projectName: 'Some template',
  projectDiscription: 'Some description that can use chalk',
  properties: [
    {
      type: 'input', // text
      name: 'name',
      message: 'Enter your name:',
      default: userInfo.name,
      test: '', // either nothing, a function that returns true / false or a regex,
      errorMessage: `${chalk.red('Error:')} Please enter a value not containing whitespace.`,
    },
  ],
  commands: {
    postInstall: [{ cmd: 'npm install', fallback: 'yarn install' }],
  },
});

const readConfig = (config, values, chalk) =>
  (typeof config === 'function' ? config(values, chalk) : config);

const chalk = require('chalk');

const readDefaultConfig = async (values = {}) => {
  console.log(await getGitUserInfo());
  return exampleConfig(Object.assign({}, { userInfo: await getGitUserInfo() }, values), chalk);
};

module.exports = { readConfig, readDefaultConfig };
