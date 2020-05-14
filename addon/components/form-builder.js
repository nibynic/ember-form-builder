import Component from '@glimmer/component';
import { action } from '@ember/object';
import { reads } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import optional from 'ember-form-builder/utilities/optional-action';
import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';

export default class FormBuilder extends Component {
  novalidate = false;

  @optional action() {}
  @optional submitFailed() {}

  @action
  submit(event) {
    event.preventDefault();
    if (!('isLoading' in this.args)) {
      this.settings.isLoading = true;
    }
    if (!('status' in this.args)) {
      this.settings.status = undefined;
    }
    this.formBuilder.validate().then(
      () => this.action()
    ).then(
      () => {
        if (!('status' in this.args)) {
          this.settings.status = 'success';
        }
      },
      (e) => {
        if (!('status' in this.args)) {
          this.settings.status = 'failure';
        }
        this.submitFailed(e);
        throw e;
      }
    ).finally(
      () => {
        if (!('isLoading' in this.args)) {
          this.settings.isLoading = false;
        }
      }
    ).catch(() => {});
  }

  constructor() {
    super(...arguments);
    this.settings = new Settings(this.args);
    this.formBuilder = getOwner(this).factoryFor('model:form-builder').create({ settings: this.settings });
  }
}

const NOT_SET = Math.random();

class Settings {

  constructor(source) {
    this.source = source;
  }

  @reads('source.for')            object;
  @reads('source.name')           modelName;
  @reads('source.translationKey') translationKey;
  @reads('source.index')          index;


  @tracked _isLoading = NOT_SET;

  @dependentKeyCompat
  get isLoading() {
    return (this._isLoading !== NOT_SET && this._isLoading) || this.source.isLoading;
  }
  set isLoading(v) {
    return this._isLoading = v;
  }


  @tracked _status = NOT_SET;

  @dependentKeyCompat
  get status() {
    return (this._status !== NOT_SET && this._status) || this.source.status;
  }
  set status(v) {
    return this._status = v;
  }
}
