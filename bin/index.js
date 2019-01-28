#!/usr/bin/env node

const opts = require('commander');
const path = require('path');
const pkg = require('../package.json');
const config = require('../config.json');
const { initialPrompt } = require('../lib/initial-prompt');
const { addTemplate } = require('../lib/add-template.js');
const insj = require('../lib/index')
console.log({ insj })
opts
  .version(pkg.version, '-v, --version')
  .option('-r, --repo <r>')
  .option('-d, --dest <d>')
  .option('-rp, --run-postinstall <d>')
  .option('-f, --force')
  .option('-a, --add [name]')
  .parse(process.argv);

const choices = Array.from(config.templates);
choices.map(choice => Object.assign(choice, { name: `${choice.name} (${choice.value})` }));
choices.sort((a, b) => b.isDefault);
choices.push({ name: 'Custom', value: 'custom' });

async function main() {
  if (opts.add) {
    await addTemplate(opts.add, config, path.resolve(__dirname, 'config.json'));
    process.exit(0);
  }

  try {
    const { pathToDestination, pathToRepo, isNewRepo } = await initialPrompt(opts, choices);
    insj({
      ...opts,
      pathToDestination: path.resolve(process.cwd(), pathToDestination),
      pathToRepo,
      isNewRepo
    })

  } catch (err) {
    if (err.message) console.error(err.message);
    process.exit(0);
  }
}

main();
