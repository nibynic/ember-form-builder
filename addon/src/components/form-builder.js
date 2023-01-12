import Component from '@glimmer/component';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';
import optional from '../utils/optional-action';
import { Settings } from './form-builder/fields';

export default class FormBuilderComponent extends Component {
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
