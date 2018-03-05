#!/usr/bin/env node

const opts = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
const config = require('./config.json');
const { cloneRepo } = require('./lib/clone');
const { copyAndDelete, deleteTemp } = require('./lib/copy-and-del');
const { getData } = require('./lib/get-data');
const { runPostInstall } = require('./lib/run-post-install');
const { initialPrompt } = require('./lib/initial-prompt');
const { addTemplate, addTemplateAfter } = require('./lib/add-template.js');

opts
  .version(pkg.version, '-v, --version')
  .option('-r, --repo <r>')
  .option('-d, --dest <d>')
  .option('-f, --force')
  .option('-a, --add [name]')
  .parse(process.argv);

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, '.tmp');
const choices = Array.from(config.templates);
choices.map(choice => Object.assign(choice, { name: `${choice.name} (${choice.value})` }));
choices.sort((a, b) => b.isDefault);
choices.push({ name: 'Custom', value: 'custom' });

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

  if (directory.length > 0 && !opts.force) {
    console.log(chalk.red('Aborting:'), 'Destination is not clean');
    console.log('    Use', chalk.cyan('--force'), 'to override');
    throw new Error();
  }
}

async function main() {
  if (opts.add) {
    await addTemplate(opts.add, config, path.resolve(__dirname, 'config.json'));
    process.exit(0);
  }
  try {
    const { pathToDestination, pathToRepo, isNewRepo } = await initialPrompt(opts, choices);
    throwIfNotClean(ROOT_PATH, pathToDestination, opts);
    await deleteTemp(TEMP_PATH);
    await cloneRepo(pathToRepo, TEMP_PATH);
    const { templateCfg, isTemplate } = getConfig(path.join(TEMP_PATH, 'config.js'));
    const data = isTemplate ? await getData(templateCfg) : {};
    await copyAndDelete(TEMP_PATH, pathToDestination, data, isTemplate);
    console.log();
    await runPostInstall(templateCfg, path.resolve(ROOT_PATH, pathToDestination));
    if (isNewRepo) {
      await addTemplateAfter(pathToRepo, config, path.resolve(__dirname, 'config.json'));
    }
    console.log('\nGo to your project by running');
    console.log(chalk.cyan(`\n\tcd ${pathToDestination}\t`));
    console.log();
  } catch (err) {
    if (err.message) console.error(err.message);
    process.exit(0);
  }
}

main();
