const opts = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const pkg = require('./package.json')
const { cloneRepo } = require('./lib/gittar')
const { config } = require('./config')
const { rename } = require('./lib/rename')
const { copyAndDelete } = require('./lib/copy-and-del')
const { getData } = require('./lib/get-data')
const { runHooks } = require('./lib/run-hooks')

opts
  .version(pkg.version, '-v, --version')
  .option('-r, --repo')
  .option('-d, --dest')
  .parse(process.argv)

const rootPath = process.cwd()
const TEMP_PATH = '.tmp'
const choices = Array.from(config.templates)
choices.push({ name: 'custom', value: 'custom' })

async function initialPrompt(opts) {
  let pathToRepo = opts._repo
  if (!pathToRepo) {
    const res = await inquirer.prompt([
      {
        name: 'pathToRepo',
        message: 'Repository name',
        type: 'list',
        choices
      }
    ])
    pathToRepo = res.pathToRepo
  }
  if (pathToRepo === 'custom') {
    const res = await inquirer.prompt([
      {
        name: 'pathToRepo',
        message: 'Repsitory name',
        type: 'input'
      }
    ])
    pathToRepo = res.pathToRepo
  }
  if (!opts.dest) {
    const res = await inquirer.prompt([
      {
        name: 'pathToDestination',
        message: 'Destination folder name',
        type: 'input'
      }
    ])
    pathToDestination = res.pathToDestination
  }

  return { pathToRepo, pathToDestination }
}

let templateCfg = {}

async function main() {
  try {
    const { pathToDestination, pathToRepo } = await initialPrompt(opts)
    console.log(pathToRepo, pathToDestination)
    const clonedRepo = await cloneRepo(pathToRepo, TEMP_PATH)
    const templateCfg = require(path.join(__dirname, TEMP_PATH, 'config.js'))
      .config
    const data = await getData(templateCfg)
    await copyAndDelete(TEMP_PATH, pathToDestination, data)
    const hooks = await runHooks(templateCfg, pathToDestination)
  } catch (err) {
    console.error(err)
  }
}

main()
