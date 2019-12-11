import Component from '@ember/component';
import layout from '../templates/components/form-builder';
import { computed } from '@ember/object';
import { reads, alias } from '@ember/object/computed';
import { getOwner } from '@ember/application';

export default Component.extend({
  layout,

  tagName: 'form',
  attributeBindings: ['novalidate'],

  novalidate: false,

  action() {},
  submitFailed() {},

  submit: function(event) {
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
    );
  },

  formBuilder: computed(function() {
    return getOwner(this).factoryFor('model:form-builder').create();
  }),

  for:            alias('formBuilder.object'),
  name:           alias('formBuilder.modelName'),
  translationKey: alias('formBuilder.translationKey'),
  model:          alias('formBuilder.model'),
  index:          alias('formBuilder.index'),

  isValid: reads('formBuilder.isValid'),

  isLoading: computed('formBuilder.isLoading', {
    get() {
      return this.get('formBuilder.isLoading');
    },
    set(k, v) {
      this._isLoadingOverridden = true;
      this.set('formBuilder.isLoading', v);
      return v;
    }
  }),

  status: computed('formBuilder.status', {
    get() {
      return this.get('formBuilder.status');
    },
    set(k, v) {
      this._statusOverridden = true;
      this.set('formBuilder.status', v);
      return v;
    }
  })
});
