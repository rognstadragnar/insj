const execa = require('execa');
const Listr = require('listr');

function createTask(hook, dir) {
  return {
    title: `Running: ${hook}`,
    task: (ctx, taskInstance) =>
      execa
        .shell(`(cd ${dir} && ${hook})`)
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Completed: ${hook}`;
        })
        .catch(() => {
          // eslint-disable-next-line no-param-reassign
          taskInstance.title = `Failed: ${hook}`;
        }),
  };
}

async function runHooks({ hooks }, dir) {
  if (Array.isArray(hooks) && hooks.length) {
    return new Listr(hooks.map(hook => createTask(hook, dir))).run();
  }
  return false;
}

module.exports = { runHooks };
