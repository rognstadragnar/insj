const insj = require('../../lib/index')
const path = require('path')

insj({
  pathToDestination: path.resolve(__dirname, 'example'),
  pathToRepo: 'rognstadragnar/module-starter'
})