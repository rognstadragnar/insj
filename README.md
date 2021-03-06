<div align="center">
  <img width="200" src="https://raw.githubusercontent.com/rognstadragnar/insj/master/logo.png" alt="Insj"> 
  <p>A <b>no excuses</b> project scaffolding tool.</i></p>
</div>

## Motivation

Apparently writing modern Javascript means writing config as much as actual code.

I want to be able to spin up a new project fast. Either from my own templates that should be easy to create, or from any git repository.

I want to be able to save my previously used templates so that I don't have to remember them myself.

I want to always get the latest version of a template straight from `git`, but I also want a cached fallback if I am offline.

**Why not existing scaffolding tools?** None of the existing scaffolding tools are as simple and straight forwards as I think they should be. Especially if you want to create your own templates, and store templates for later use.

## Usage

Simply install `insj` globally from `npm`:

```sh
npm install insj --global

# or

npx insj <options>
```

and then simply run `insj` like so:

<div align="center">
  <img src="https://raw.githubusercontent.com/rognstadragnar/insj/master/insj.gif" alt="How to use insj "> 
</div>

If the repository you choose isn't a valid `insj`-template it will simply be cloned into your chosen folder.

### Node API

```js
const insj = require('insj')
const path = require('path')

insj({
  pathToDestination: path.resolve(__dirname, 'example'),
  pathToRepo: 'rognstadragnar/module-starter'
})
```

#### Creating templates

A template is a git repository that contains a `config.js` file and a `src` folder.

Template file structure looks like this:

```
+-- config.js
+-- src
    + -- # code goes here
```

The config file can contain an array of `properties` and an array of `postInstall`-commands (aka terminal commands).

```Javascript
// Example config
module.exports = {
  properties: ['name', 'description'],
  postInstall: ['git init', 'npm install']
}
```

The user user will be asked for the 'properties' at project initiation, so `insj` can replace these values in the template with the user supplied values.

`insj` uses the [handlebarjs](handlebarsjs.com) template syntax. This means that every instance of `{{ name }}` will be replaced with the user entered name value.

The `postInstall`-commands will be ran after the project has been initiated. In the example config `git init` and `npm install` will be ran after `insj` has completed the setup.

Example template: [module-starter](https://github.com/rognstadragnar/module-starter)

#### Storing templates

`insj` enables you to store templates for later use.
By running `insj -a` or `injs -a <name>` you will be asked for a name, path and whether the template should be the default template or not.

_Note: `insj` only stores the path to the repository, not the actual files – ensuring that you always get the latest template_

## Todo

* Private repository support
* Add more flexibilty to post-install commands
