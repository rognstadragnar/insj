const del = require('del')
const copy = require('graceful-copy')
const Listr = require('listr')

async function copyAndDelete(src, dest, data, isTemplate) {
  const srcToCopyFrom = isTemplate ? `${src}/src` : src
  const destToCopyTo = isTemplate ? `../${dest}` : dest
  console.log('IS TEMPLATE?', srcToCopyFrom, destToCopyTo)

  const task = new Listr([
    {
      title: isTemplate
        ? 'Renaming and copying files according to config.js'
        : 'Copying files',
      task: async (ctx, taskInstance) => {
        await copy(srcToCopyFrom, destToCopyTo, {
          data,
          clean: false
        })
        await del([`${src}/**`])
        taskInstance.title = isTemplate
          ? 'Renamed and copied files according to config.js'
          : 'Copied files'
      }
    }
  ])

  return await task.run()
}

module.exports = { copyAndDelete }
