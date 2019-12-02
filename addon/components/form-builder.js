import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { getOwner } from '@ember/application';

export default Component.extend({
  tagName: "form",

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

  formBuilder: computed("for", "as", "translationKey", 'index', function() {
    let params = {};
    let mapping = {
      for: 'object',
      as: 'modelName',
      translationKey: 'translationKey',
      model: 'model',
      index: 'index'
    };
    Object.entries(mapping).forEach(([from, to]) => {
      let value = this.get(from);
      if (isPresent(value)) {
        params[to] = value;
      }
    });
    if (this.get('as') === '') {
      params.modelName = this.get('as');
    }
    return getOwner(this).factoryFor('model:form-builder').create(params);
  }),

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
