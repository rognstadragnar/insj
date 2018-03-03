const del = require('del')
const copy = require('graceful-copy')
const Listr = require('listr')

async function copyAndDelete(src, dest, data) {
  // const copyFiles = await copy(`${src}/_src`, '../' + dest, {
  //   data,
  //   clean: false
  // })
  // const deleteFiles = await del([`${src}/**`])

  const task = new Listr([
    {
      title: 'Renaming files according to config.js',
      task: async (ctx, taskInstance) => {
        await copy(`${src}/src`, '../' + dest, {
          data,
          clean: false
        })
        await del([`${src}/**`])
        taskInstance.title = 'Renamed files according to config.js'
      }
    }
  ])

  return await task.run()
}

module.exports = { copyAndDelete }
