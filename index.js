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

opts.version(pkg.version, '-v, --version').parse(process.argv)

const TEMP_PATH = './__init'
const choices = Array.from(config.templates)
choices.push({ name: 'custom', value: 'custom' })

async function initialPrompt() {
  const questions = await inquirer
    .prompt([
      {
        name: 'pathToRepo',
        message: 'Path to repo',
        type: 'list',
        choices
      }
    ])
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
      return Object.assign({}, qs, { path: qs.pathToRepo })
    })
    .catch(console.error)
  return questions
}

let templateCfg = {}

try {
  initialPrompt()
    .then(question => {
      return cloneRepo(question.path, TEMP_PATH).catch(console.error)
    })
    .then(questions => {
      templateCfg = require(path.join(__dirname, TEMP_PATH, 'config.js')).config
      return getData(questions, templateCfg)
    })
    .then(data => copyAndDelete('./__init/', './__real', data))
    .then(_ => runHooks(templateCfg))
    .catch(console.error)
} catch (err) {
  console.error(err)
}
