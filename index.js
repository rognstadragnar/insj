#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');
const pkg = require('./package.json');
const { cloneRepo } = require('./lib/clone');
const { copyAndDelete, deleteTemp } = require('./lib/copy-and-del');
const { getData } = require('./lib/get-data');
const { runPostInstall } = require('./lib/run-post-install');
const { addTemplateAfter } = require('./lib/add-template.js');

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, '.insj_tmp');

function getConfig(pathToCfg) {
  try {
    return {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      templateCfg: require(pathToCfg),
      isTemplate: true,
    };
  } catch (err) {
    return {
      templateCfg: {},
      isTemplate: false,
    };
  }
}

function throwIfNotClean(rootPath, pathToDestination) {
  let directory;
  try {
    directory = fs.readdirSync(path.resolve(ROOT_PATH, pathToDestination));
  } catch (err) {
    return;
  }

  if (directory.length > 0) {
    console.log(chalk.red('Aborting:'), 'Destination is not clean');
    console.log('    Use', chalk.cyan('--force'), 'to override');
    throw new Error();
  }
}

const defaultOptions = {
  add: false,
  isNewRepo: false,
  pathToDestination: '.',
  pathToRepo: '',
  force: true,
  rp: true
}

module.exports = async function insj(opts) {
  console.log(`\n\n\t\t${chalk.gray(`insj (${pkg.version})`)}\n\n`)

  const options = Object.assign({}, defaultOptions, opts)
  const { pathToDestination, pathToRepo, isNewRepo, force, rp } = options

  try {
    if (!force) {
      throwIfNotClean(ROOT_PATH, pathToDestination, opts);
    }

    await deleteTemp(TEMP_PATH);
    await cloneRepo(pathToRepo, TEMP_PATH);
    const { templateCfg, isTemplate } = getConfig(path.join(TEMP_PATH, 'config.js'));
    const data = isTemplate ? await getData(templateCfg) : {};
    await copyAndDelete(TEMP_PATH, pathToDestination, data, isTemplate);
    console.log();
    if (rp) {
      await runPostInstall(templateCfg, path.resolve(ROOT_PATH, pathToDestination));
    }
    if (isNewRepo) {
      await addTemplateAfter(pathToRepo, config, path.resolve(__dirname, 'config.json'));
    }

    if (pathToDestination !== '.') {
      console.log('\nGo to your project by running');
      console.log(chalk.cyan(`\n\tcd ${pathToDestination}\t`));
      console.log();
    }
  } catch (err) {
    if (err.message) console.error(err.message);
    process.exit(0);
  }
}

