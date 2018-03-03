const execa = require('execa')
const Listr = require('listr')

function createTask(hook, dir) {
  return {
    title: `Running: ${hook}`,
    task: (ctx, taskInstance) => {
      return execa
        .shell(`(cd ${dir} && ${hook})`)
        .then(_ => (taskInstance.title = `Completed: ${hook}`))
        .catch(err => (taskInstance.title = `Failed: ${hook}`))
    }
  }
}

async function runHooks({ hooks }, dir) {
  if (Array.isArray(hooks) && hooks.length) {
    return await new Listr(hooks.map(hook => createTask(hook, dir))).run()
  }
}

module.exports = { runHooks }
