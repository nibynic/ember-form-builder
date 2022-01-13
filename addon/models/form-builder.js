import { set } from '@ember/object';
import { reads } from '@ember/object/computed';
import { camelize } from '@ember/string';
import { all } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { isBlank } from '@ember/utils';
import { getOwner } from '@ember/application';
import defaultConfiguration from 'ember-form-builder/configuration';
import { assign } from '@ember/polyfills';
import { tracked } from '@glimmer/tracking';
import classic from 'ember-classic-decorator';

@classic
export default class FormBuilder extends EmberObject {
  @tracked isValid = true;
  @tracked parent;

  settings = {};
  children = A([]);

  init() {
    super.init(...arguments);

    let owner = getOwner(this);

    this.configuration = assign(
      {},
      defaultConfiguration,
      owner.factoryFor('config:environment').class.formBuilder || {}
    );

    this.validationAdapter = owner
      .factoryFor(`validation-adapter:${this.configuration.validationsAddon}`)
      .create({ object: this.object });
    set(
      this,
      'dataAdapter',
      owner
        .factoryFor(`data-adapter:${this.configuration.dataAddon}`)
        .create({ object: this.object })
    );
  }

  addChild(childFormBuilder) {
    this.children.addObject(childFormBuilder);
    childFormBuilder.set('parent', this);
  }

  removeChild(childFormBuilder) {
    this.children.removeObject(childFormBuilder);
    childFormBuilder.set('parent', null);
  }

  validate() {
    var validations = [];

    validations.push(this.validationAdapter.validate());

    this.children.forEach((child) => {
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

  @reads('settings.object') object;
  @reads('settings.status') status;
  @reads('settings.index') index;
  @reads('dataAdapter.model') model;

  get modelName() {
    return this.settings.modelName !== undefined
      ? this.settings.modelName
      : this.dataAdapter.modelName;
  }

  get translationKey() {
    return this.settings.translationKey || camelize(this.modelName || '');
  }

  @computed('modelName', 'parent.name', 'index')
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
