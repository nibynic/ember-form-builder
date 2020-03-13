import classic from 'ember-classic-decorator';
import { attributeBindings, tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/form-builder';
import { getOwner } from '@ember/application';

@classic
@templateLayout(layout)
@tagName('form')
@attributeBindings('novalidate')
export default class FormBuilder extends Component {
  novalidate = false;
  action() {}
  submitFailed() {}

  submit(event) {
    event.preventDefault();
    if (!this._isLoadingOverridden) {
      this.set('formBuilder.isLoading', true);
    }
    if (!this._statusOverridden) {
      this.set('formBuilder.status', undefined);
    }
    this.get('formBuilder').validate().then(
      () => this.action()
    ).then(
      () => {
        if (!this._statusOverridden) {
          this.set('formBuilder.status', 'success');
        }
      },
      (e) => {
        if (!this._statusOverridden) {
          this.set('formBuilder.status', 'failure');
        }
        this.submitFailed(e);
        throw e;
      }
    ).finally(
      () => {
        if (!this._isLoadingOverridden) {
          this.set('formBuilder.isLoading', false);
        }
      }
    ).catch(() => {});
  }

  @computed
  get formBuilder() {
    return getOwner(this).factoryFor('model:form-builder').create();
  }

  @alias('formBuilder.object')
  for;

  @alias('formBuilder.modelName')
  name;

  @alias('formBuilder.translationKey')
  translationKey;

  @alias('formBuilder.model')
  model;

  @alias('formBuilder.index')
  index;

  @reads('formBuilder.isValid')
  isValid;

  @computed('formBuilder.isLoading')
  get isLoading() {
    return this.get('formBuilder.isLoading');
  }

  set isLoading(v) {
    this._isLoadingOverridden = true;
    this.set('formBuilder.isLoading', v);
    return v;
  }

  @computed('formBuilder.status')
  get status() {
    return this.get('formBuilder.status');
  }

  set status(v) {
    this._statusOverridden = true;
    this.set('formBuilder.status', v);
    return v;
  }
}
