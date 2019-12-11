import FormBuilder from 'ember-form-builder/components/form-builder';
import { computed } from '@ember/object';

export default FormBuilder.extend({
  tagName: 'div',

  parentFormBuilder: computed('on.formBuilder', {
    get() {
      return this._parentFormBuilder || this.get('on.formBuilder') || this.get('on');
    },
    set(k, v) {
      return this._parentFormBuilder = v;
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.get('parentFormBuilder').addChild(this.get('formBuilder'));
  },

  willDestroy() {
    this._super(...arguments);
    this.get('parentFormBuilder').removeChild(this.get('formBuilder'));
  }
});
