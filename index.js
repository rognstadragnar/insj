const opts = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const pkg = require('./package.json')
const config = require('./config')
const { cloneRepo } = require('./lib/clone')
const { rename } = require('./lib/rename')
const { copyAndDelete } = require('./lib/copy-and-del')
const { getData } = require('./lib/get-data')
const { runHooks } = require('./lib/run-hooks')
const { prompt } = require('./lib/prompt')

opts
  .version(pkg.version, '-v, --version')
  .option('-r, --repo <r>')
  .option('-d, --dest <d>')
  .option('-f, --force')
  .parse(process.argv)

const ROOT_PATH = process.cwd()
const TEMP_PATH = '.tmp'
const choices = Array.from(config.templates)
choices.push({ name: 'Custom', value: 'custom' })

async function initialPrompt(opts) {
  let pathToRepo = opts.repo
  let pathToDestination = opts.dest
  if (!pathToRepo) {
    const res = await prompt({
      name: 'pathToRepo',
      value: 'repository name',
      choices
    })
    pathToRepo = res.pathToRepo
  }
  if (pathToRepo === 'custom') {
    const res = await prompt({ name: 'pathToRepo', value: 'repository name' })
    pathToRepo = res.pathToRepo
  }
  if (!opts.dest) {
    const res = await prompt({
      name: 'pathToDestination',
      value: 'destination folder name'
    })
    pathToDestination = res.pathToDestination
  }
  if (!pathToDestination) {
    console.log(chalk.yellow('Warning:'), 'Path to destination folder is empty')
    console.log('Do you really want to use this folder as destination?')
    console.log('Continuing may result in overwriting existing files')
    const res = await inquirer.prompt([
      {
        name: 'confirmDestination',
        message: 'Are you sure you want to continue?',
        type: 'confirm'
      }
    ])
    if (res.confirmDestination) {
      console.log(chalk.cyan('    This feature is a TODO'))
    }
    throw Error()
  }
  return { pathToRepo, pathToDestination }
}

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
  try {
    const { pathToDestination, pathToRepo } = await initialPrompt(opts)
    throwIfNotClean(ROOT_PATH, pathToDestination, opts)
    await cloneRepo(pathToRepo, TEMP_PATH)
    const { templateCfg, isTemplate } = getConfig(
      path.join(__dirname, TEMP_PATH, 'config.js')
    )
    const data = isTemplate ? await getData(templateCfg) : {}
    await copyAndDelete(TEMP_PATH, pathToDestination, data, isTemplate)
    await runHooks(templateCfg, pathToDestination)
    console.log('Completed')
    console.log()
    console.log('Destination folder can be found by running')
    console.log(`   cd ${pathToDestination}`)
  } catch (err) {
    if (err.message) console.error(err.message)
    process.exit(0)
  }
}

main()
