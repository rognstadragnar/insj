const gittar = require('gittar')
const Listr = require('listr')

async function cloneRepo(repoPath, destPath) {
  const task = new Listr([
    {
      title: `Cloning git repository ${repoPath}`,
      task: async (ctx, taskInstance) => {
        const clone = await gittar.fetch(repoPath)
        const extracted = await gittar.extract(clone, destPath)
        taskInstance.title = `Cloned git repository ${repoPath}`

        return extracted
      }
    }
  ])

  return await task.run()
}

module.exports = { cloneRepo }
