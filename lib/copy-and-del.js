const del = require('del');
const copy = require('graceful-copy');
const Listr = require('listr');

async function copyAndDelete(src, dest, data, isTemplate) {
  const srcToCopyFrom = isTemplate ? `${src}/src` : src;
  const destToCopyTo = isTemplate ? `../${dest}` : dest;
  const task = new Listr([
    {
      title: isTemplate ? 'Renaming and copying files according to config.js' : 'Copying files',
      task: async (ctx, taskInstance) => {
        await copy(srcToCopyFrom, destToCopyTo, {
          data,
          clean: false,
        });
        await del([`${src}/**`]);
        // eslint-disable-next-line no-param-reassign
        taskInstance.title = isTemplate
          ? 'Renamed and copied files according to config.js'
          : 'Copied files';
      },
    },
  ]);
  return task.run();
}

async function deleteTemp(path) {
  const task = new Listr([
    {
      title: 'Cleaning .temp folder',
      task: async (ctx, taskInstance) => {
        await del([`${path}/**`]);
        // eslint-disable-next-line no-param-reassign
        taskInstance.title = 'Cleaned .temp folder';
      },
    },
  ]);
  return task.run();
}

module.exports = { copyAndDelete, deleteTemp };
