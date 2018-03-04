const Listr = require('listr');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function createTask(command, dir) {
  return {
    title: `Running: ${command}`,
    task: async (ctx, taskInstance) => {
      await exec(command, {
        cwd: dir,
      })
        .then(res => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Completed: ${command}`;
          return res;
        })
        .catch(err => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Failed: ${command}`;
          return err;
        });
    },
  };
}

async function runPostInstall({ postInstall = [] }, dir) {
  if (Array.isArray(postInstall) && postInstall.length) {
    return new Listr([
      {
        title: 'Post-install commands',
        task: () => new Listr(postInstall.map(hook => createTask(hook, dir))),
      },
    ]).run();
  }
  return false;
}

module.exports = { runPostInstall };
