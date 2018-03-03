const replace = require('replace')

function rename(dir, terms) {
  return terms.forEach(term => {
    console.log(term)
    replace({
      regex: term.regex,
      replacement: term.value,
      paths: [dir],
      recursive: true,
      silent: false
    })
  })
}

module.exports = { rename }
