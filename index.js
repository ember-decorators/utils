/* eslint-env node */
'use strict';

const FilterImports = require('babel-plugin-filter-imports');
const Funnel = require('broccoli-funnel');

function isProductionEnv() {
  const isProd = /production/.test(process.env.EMBER_ENV);
  const isTest = process.env.EMBER_CLI_TEST_COMMAND;

  return isProd && !isTest;
}

module.exports = {
  name: '@ember-decorators/utils',

  _getParentOptions() {
    let options;

    // The parent can either be an Addon or a Project. If it's an addon,
    // we want to use the app instead. This public method probably wasn't meant
    // for this, but it's named well enough that we can use it for this purpose.
    if (this.parent && !this.parent.isEmberCLIProject) {
      options = this.parent.options = this.parent.options || {};
    } else {
      options = this.app.options = this.app.options || {};
    }

    return options;
  },

  treeForAddon(tree) {
    const filteredTree = !(isProductionEnv() && !this.disableCodeStripping) ? tree : new Funnel(tree, {
      exclude: ['debug']
    });

    return this._super(filteredTree);
  },

  included() {
    this._super.included.apply(this, arguments);

    let parentOptions = this._getParentOptions();

    this.disableCodeStripping = parentOptions.emberDecoratorUtils && parentOptions.emberDecoratorUtils.disableCodeStripping;

    if (!this._registeredWithBabel) {
      // Create babel options if they do not exist
      parentOptions.babel = parentOptions.babel || {};

      // Create and pull off babel plugins
      let plugins = parentOptions.babel.plugins = parentOptions.babel.plugins || [];

      if (isProductionEnv() && !this.disableCodeStripping) {
        plugins.push(
          [FilterImports, {
            imports: {
              '@ember-decorators/utils/debug': [
                'validationsFor',
                'validationsForKey'
              ]
            }
          }]
        );
      }

      this._registeredWithBabel = true;
    }
  }
};
