import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';
import { getOwner } from '@ember/application';

export default class FieldsComponent extends Component {
  @action
  initializeBuilder() {
    this.args.on.addChild(this.formBuilder);
  }

  @action
  destroyBuilder() {
    this.args.on.removeChild(this.formBuilder);
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

export class Settings {
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
