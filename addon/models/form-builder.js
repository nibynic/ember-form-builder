import { camelize } from '@ember/string';
import { all } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { pluralize } from 'ember-inflector';
import { isBlank } from '@ember/utils';
import byDefault from 'ember-form-builder/utilities/by-default';
import { getOwner } from '@ember/application';
import defaultConfiguration from 'ember-form-builder/configuration';
import { assign } from '@ember/polyfills';

export default EmberObject.extend({
  status: null,

  isValid: true,

  children: computed(function() {
    return A([]);
  }),

  addChild(childFormBuilder) {
    this.get("children").addObject(childFormBuilder);
    childFormBuilder.set('parent', this);
  },

  removeChild(childFormBuilder) {
    this.get("children").removeObject(childFormBuilder);
    childFormBuilder.set('parent', null);
  },

  configuration: computed(function() {
    return assign(
      {}, defaultConfiguration,
      getOwner(this).factoryFor('config:environment').class.formBuilder || {}
    );
  }),

  validate() {
    var validations = [];

    validations.push(this.validationAdapter.validate());

    this.get("children").forEach((child) => {
      validations.push(child.validate());
    });

    return all(validations).then(
      () => this.set('isValid', true),
      (e) => {
        this.set('isValid', false);
        throw e;
      }
    );
  },

  validationAdapter: computed('configuration.validationsAddon', function() {
    let name = this.get('configuration.validationsAddon');
    return getOwner(this).factoryFor(`validation-adapter:${name}`).create({ object: this.object });
  }),

  dataAdapter: computed('configuration.validationsAddon', function() {
    let name = this.get('configuration.dataAddon');
    return getOwner(this).factoryFor(`data-adapter:${name}`).create({ object: this.object });
  }),

  model: reads('dataAdapter.model'),
  modelName: reads('dataAdapter.modelName'),

  translationKey: byDefault('modelName', function() {
    return camelize(this.get('modelName') || '');
  }),

  name: computed('modelName', 'parent.name', 'index', function() {
    let prefix = camelize(this.get('parent.name') || '');
    let name = camelize(this.get('modelName') || '');
    let index = this.get('index');
    if (!isBlank(index)) {
      name = pluralize(name);
    }
    return A([ prefix, name, index ])
      .reject(isBlank).map(
        (n, i) => i > 0 ? `[${n}]` : n
      ).join('');
  }),

  isLoading: reads('parent.isLoading')
});
