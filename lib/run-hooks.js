const Listr = require('listr');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function createTask(hook, dir) {
  return {
    title: `Running: ${hook}`,
    task: async (ctx, taskInstance) => {
      await exec(hook, {
        cwd: dir,
      })
        .then(res => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Completed: ${hook}`;
          return res;
        })
        .catch(err => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Failed: ${hook}`;
          return err;
        });
    },
  };
}

async function runHooks({ hooks }, dir) {
  if (Array.isArray(hooks) && hooks.length) {
    return new Listr([
      {
        title: 'Running hooks',
        task: () => new Listr(hooks.map(hook => createTask(hook, dir))),
      },
    ]).run();
  }
  return false;
}

module.exports = { runHooks };
