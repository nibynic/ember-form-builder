import Component from '@glimmer/component';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import optional from '../utils/optional-action';
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
    this.formBuilder
      .validate()
      .then(() => this.action())
      .then(
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
      )
      .finally(() => {
        if (!('isLoading' in this.args)) {
          this.settings.isLoading = false;
        }
      })
      .catch(() => {});
  }

  constructor() {
    super(...arguments);
    this.settings = new Settings(this.args);
    this.formBuilder = getOwner(this)
      .factoryFor('model:form-builder')
      .create({ settings: this.settings });
  }
}

const NOT_SET = Math.random();

class Settings {
  @tracked source;

  constructor(source) {
    this.source = source;
  }

  @dependentKeyCompat
  get object() {
    return this.source.for;
  }

  @dependentKeyCompat
  get modelName() {
    return this.source.name;
  }

  @dependentKeyCompat
  get translationKey() {
    return this.source.translationKey;
  }

  @dependentKeyCompat
  get index() {
    return this.source.index;
  }

  @tracked _isLoading = NOT_SET;

  @dependentKeyCompat
  get isLoading() {
    return (
      (this._isLoading !== NOT_SET && this._isLoading) || this.source.isLoading
    );
  }
  set isLoading(v) {
    this._isLoading = v;
  }

  @tracked _status = NOT_SET;

  @dependentKeyCompat
  get status() {
    return (this._status !== NOT_SET && this._status) || this.source.status;
  }
  set status(v) {
    this._status = v;
  }
}
