const degit = require('degit')

async function cloneRepo(repo, path) {
  return new Promise((resolve, reject) => {
    try {
      const emitter = degit(repo, {
        cache: true,
        force: true,
        verbose: true
      })
      emitter.on('info', resolve)
      emitter.clone(path, resolve)
    } catch (err) {
      reject(err)
    }
  }).catch(console.error)
}

module.exports = { cloneRepo }
