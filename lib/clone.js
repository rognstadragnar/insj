const gittar = require('gittar');
const Listr = require('listr');

async function cloneRepo(repoPath, destPath) {
  const task = new Listr([
    {
      title: `Cloning git repository ${repoPath}`,
      task: async (ctx, taskInstance) => {
        const clone = await gittar.fetch(repoPath, { force: true });
        const extracted = await gittar.extract(clone, destPath);
        // eslint-disable-next-line no-param-reassign
        taskInstance.title = `Cloned git repository ${repoPath}`;

        return extracted;
      },
    },
  ]);

  const run = await task.run();
  return run;
}

module.exports = { cloneRepo };
