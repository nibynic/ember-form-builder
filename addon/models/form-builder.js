import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import { camelize } from '@ember/string';
import { all } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { isBlank } from '@ember/utils';
import byDefault from 'ember-form-builder/utilities/by-default';
import { getOwner } from '@ember/application';
import defaultConfiguration from 'ember-form-builder/configuration';
import { assign } from '@ember/polyfills';

@classic
export default class FormBuilder extends EmberObject {
  status = null;
  isValid = true;

  @computed
  get children() {
    return A([]);
  }

  addChild(childFormBuilder) {
    this.get("children").addObject(childFormBuilder);
    childFormBuilder.set('parent', this);
  }

  removeChild(childFormBuilder) {
    this.get("children").removeObject(childFormBuilder);
    childFormBuilder.set('parent', null);
  }

  @computed
  get configuration() {
    return assign(
      {}, defaultConfiguration,
      getOwner(this).factoryFor('config:environment').class.formBuilder || {}
    );
  }

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
  }

  @computed('configuration.validationsAddon')
  get validationAdapter() {
    let name = this.get('configuration.validationsAddon');
    return getOwner(this).factoryFor(`validation-adapter:${name}`).create({ object: this.object });
  }

  @computed('configuration.validationsAddon')
  get dataAdapter() {
    let name = this.get('configuration.dataAddon');
    return getOwner(this).factoryFor(`data-adapter:${name}`).create({ object: this.object });
  }

  @reads('dataAdapter.model')
  model;

  @reads('dataAdapter.modelName')
  modelName;

  @byDefault('modelName', function() {
    return camelize(this.get('modelName') || '');
  })
  translationKey;

  @computed('modelName', 'parent.name', 'index')
  get name() {
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
  }

  @reads('parent.isLoading')
  isLoading;
}
