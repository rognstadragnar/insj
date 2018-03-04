<div align="center">
  <img width="200" src="https://raw.githubusercontent.com/rognstadragnar/insj/master/insj.png" alt="Insj"> 
  <p>A <b>no excuses</b> project scaffolding tool.</i></p>
</div>

## Motivation

Apparently writing modern Javascript means writing config-files as much as actual code.

I want to be able to spin up a new project fast. Either from my own templates that are simple to create, or from any git repository.

**Why not existing scaffolding tools?** None of the existing scaffolding tools are as simple and straight forwards as I think they should be. Especially if you want to create your own templates, and store templates for later use.

## Usage

Simply install `insj` globally from `npm`:

```sh
npm install insj --global
```

and then simply run `insj` like so:

<div align="center">
  <img src="https://raw.githubusercontent.com/rognstadragnar/insj/master/insj.gif" alt="How to use insj "> 
</div>

If the repository you choose isn't a valid `insj`-template it will simply be cloned into your chosen folder.

#### Creating templates

A template is a git repository that contains a `config.js` file and a `src` folder.

Template file structure looks like this:

```
+-- config.js
+-- src
    + -- # code goes here
```

The config file can contain an array of `properties` and an array of `hooks` (aka terminal commands).

```Javascript
// Example config
module.exports = {
  properties: ['name', 'description'],
  hooks: ['git init', 'npm install']
}
```

The user user will be asked for the 'properties' at project initiation, so `insj` can replace these values in the template with the user supplied values.

`insj` uses the [handlebarjs](handlebarsjs.com) template syntax. This means that every instance of `{{ name }}` will be replaced with the user entered name value.

The `hooks` will be ran after the project has been initiated. In the example config `git init` and `npm install` will be ran after `insj` has completed the setup.

Example template: [module-starter](https://github.com/rognstadragnar/module-starter)

#### Storing templates

`insj` enables you to store templates for later use.
By running `insj -a` or `injs -a <name>` you will be asked for a name, path and whether the template should be the default template or not.

_Note: `insj` only stores the path to the repository, not the actual files – ensuring that you always get the latest template_
