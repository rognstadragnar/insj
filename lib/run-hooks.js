const execa = require('execa')
const Listr = require('listr')

const isObj = what => what && typeof what === 'object'

function createTask(hook) {
  console.log(hook)
  const isTaskObj = isObj(hook)
  const task = isTaskObj ? hook.task : hook
  const title = isTaskObj ? hook.title || task : hook

  return new Listr([
    {
      title,
      task: (ctx, taskInstance) => {
        return execa.shell(task).catch(err => {
          if (isObj(hook) && hook.isSkipable) {
            taskInstance.skip(`Hook '${task}' failed and was skipped`)
          } else {
            throw new Error(`Hook '${task}' failed.`)
          }
        })
      }
    }
  ])
}

function simpleTask(hook) {
  return {
    title: hook,
    task: () => execa.shell(`(cd __init && ${hook})`)
  }
}

async function runHooks(config) {
  if (config.hooks) {
    const tasks = config.hooks.map(simpleTask)
    console.log('TASKS', tasks)
    return await new Listr(tasks).run()
  }
}

module.exports = { runHooks }
