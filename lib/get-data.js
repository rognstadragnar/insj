const path = require('path')
const { prompt } = require('./prompt')

async function getData(config) {
  try {
    const { properties } = config
    const userInput = await prompt(properties)
    const data = properties.reduce((pv, cv) => {
      return Object.assign(pv, { [cv]: userInput[cv] })
    }, {})
    return data
  } catch (err) {
    console.error('error in get data', config, err)
  }
}

module.exports = { getData }
