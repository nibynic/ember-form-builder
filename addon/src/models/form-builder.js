import { camelize } from 'ember-cli-string-utils';
import { all } from 'rsvp';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { pluralize } from 'ember-inflector';
import { isBlank } from '@ember/utils';
import { getOwner } from '@ember/application';
import defaultConfiguration from '../configuration';
import { tracked } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

export default class FormBuilder extends EmberObject {
  @tracked isValid = true;
  @tracked parent;

  settings = {};
  children = A([]);

  constructor() {
    super(...arguments);
    this.configuration = Object.assign(
      {},
      defaultConfiguration,
      getOwner(this).factoryFor('config:environment').class.formBuilder || {}
    );
  }

  #validationAdapter = createCache(() =>
    getOwner(this)
      .factoryFor(`validation-adapter:${this.configuration.validationsAddon}`)
      .create({ object: this.object })
  );
  get validationAdapter() {
    return getValue(this.#validationAdapter);
  }

  #dataAdapter = createCache(() =>
    getOwner(this)
      .factoryFor(`data-adapter:${this.configuration.dataAddon}`)
      .create({ object: this.object })
  );
  get dataAdapter() {
    return getValue(this.#dataAdapter);
  }

  addChild(childFormBuilder) {
    this.children.addObject(childFormBuilder);
    childFormBuilder.parent = this;
  }

  removeChild(childFormBuilder) {
    this.children.removeObject(childFormBuilder);
    childFormBuilder.parent = null;
  }

  async validate() {
    var validations = [];

    validations.push(this.validationAdapter.validate());

    this.children.forEach((child) => {
      validations.push(child.validate());
    });

    try {
      await all(validations);
      this.isValid = true;
    } catch (e) {
      this.isValid = false;
      throw e;
    }
  }

  get object() {
    return this.settings.object;
  }
  get status() {
    return this.settings.status;
  }
  get index() {
    return this.settings.index;
  }
  get model() {
    return this.dataAdapter.model;
  }

  get modelName() {
    return this.settings.modelName !== undefined
      ? this.settings.modelName
      : this.dataAdapter.modelName;
  }

  get translationKey() {
    return this.settings.translationKey || camelize(this.modelName || '');
  }

  get name() {
    let prefix = camelize((this.parent && this.parent.name) || '');
    let name = camelize(this.modelName || '');
    let index = this.index;
    if (!isBlank(index)) {
      name = pluralize(name);
    }
    return A([prefix, name, index])
      .reject(isBlank)
      .map((n, i) => (i > 0 ? `[${n}]` : n))
      .join('');
  }

  get isLoading() {
    return (
      (this.settings.isLoading !== undefined && this.settings.isLoading) ||
      (this.parent && this.parent.isLoading)
    );
  }
}
