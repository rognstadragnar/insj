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
  console.log('opts', {
    pathToRepo,
    pathToDestination
  })

  return {
    pathToRepo,
    pathToDestination
  }
  /*   
      {
              name: 'pathToDestination',
              message: 'Destination folder',
              type: 'input'
            }
    
    
    .then(qs => {
      if (qs.pathToRepo === 'custom') {
        return inquirer
          .prompt([
            {
              name: 'customPathToRepo',
              message: 'Custom path:',
              type: 'input'
            }
          ])
          .then(nq => Object.assign({}, qs, nq, { path: nq.customPathToRepo }))
          .catch(err => Error(err))
      }
      return Object.assign({}, qs, { path: qs.pathToRepo }) */
}

let templateCfg = {}

// try {
//   initialPrompt(opts)
//     .then(parameters => {
//       cloneRepo(parameters.pathToRepo, TEMP_PATH).catch(console.error)
//       return parameters
//     })
//     .then(parameters => {
//       templateCfg = require(path.join(__dirname, TEMP_PATH, 'config.js')).config
//       return getData(templateCfg)
//     })
//     .then(data => copyAndDelete('./__init/', './__real', data))
//     .then(_ => runHooks(templateCfg, dir))
//     .catch(console.error)
// } catch (err) {
//   console.error(err)
// }

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
