const opts = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const pkg = require('./package.json')
const config = require('./config.json')
const { cloneRepo } = require('./lib/clone')
const { rename } = require('./lib/rename')
const { copyAndDelete, deleteTemp } = require('./lib/copy-and-del')
const { getData } = require('./lib/get-data')
const { runHooks } = require('./lib/run-hooks')
const { prompt } = require('./lib/prompt')
const { initialPrompt } = require('./lib/initial-prompt')
const { addTemplate } = require('./lib/add-template.js')
opts
  .version(pkg.version, '-v, --version')
  .option('-r, --repo <r>')
  .option('-d, --dest <d>')
  .option('-f, --force')
  .option('-a, --add [name]')
  .parse(process.argv)

const ROOT_PATH = process.cwd()
const TEMP_PATH = path.join(ROOT_PATH, '.tmp')
const choices = Array.from(config.templates)
choices.sort((a, b) => b.isDefault)
choices.push({ name: 'Custom', value: 'custom' })

function getConfig(pathToCfg) {
  try {
    return {
      templateCfg: require(pathToCfg),
      isTemplate: true
    }
  } catch (err) {
    return {
      templateCfg: {},
      isTemplate: false
    }
  }
}

function throwIfNotClean(rootPath, pathToDestination, opts) {
  let directory
  try {
    directory = fs.readdirSync(path.resolve(ROOT_PATH, pathToDestination))
  } catch (err) {
    return
  }

  if (directory.length > 0 && !opts.force) {
    console.log(chalk.red('Aborting:'), 'Destination is not clean')
    console.log('    Use', chalk.cyan('--force'), 'to override')
    throw new Error()
  }
}

async function main() {
  if (opts.add) {
    await addTemplate(opts.add, config, path.resolve(__dirname, 'config.json'))
    process.exit(0)
  }
  try {
    const { pathToDestination, pathToRepo } = await initialPrompt(opts, choices)
    throwIfNotClean(ROOT_PATH, pathToDestination, opts)
    await deleteTemp(TEMP_PATH)
    await cloneRepo(pathToRepo, TEMP_PATH)
    const { templateCfg, isTemplate } = getConfig(
      path.join(__dirname, TEMP_PATH, 'config.js')
    )
    const data = isTemplate ? await getData(templateCfg) : {}
    await copyAndDelete(TEMP_PATH, pathToDestination, data, isTemplate)
    await runHooks(templateCfg, pathToDestination)
    console.log('\nGo to your project by running')
    console.log(chalk.cyan(`\n\tcd ${pathToDestination}\t`))
    console.log()
  } catch (err) {
    if (err.message) console.error(err.message)
    process.exit(0)
  }
}

main()
