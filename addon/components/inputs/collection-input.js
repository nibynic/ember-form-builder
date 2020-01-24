import Component from '@ember/component';
import layout from '../../templates/components/inputs/collection-input';
import { get, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import { reads, alias } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { next, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';

export default Component.extend({
  layout,

  tagName: 'select',
  attributeBindings: ['autocomplete', 'autofocus', 'dir', 'disabled', 'inputmode',
    'multiple', 'name', 'pattern', 'placeholder', 'required', 'size', 'tabindex'],

  optionComponentName: 'inputs/select-option',

  value: alias('config.value'),

  collectionPromise: computed('collection', function() {
    return ObjectProxy.extend(PromiseProxyMixin).create({
      promise: resolve(this.get('collection'))
    });
  }),

  resolvedCollection: computed('collectionPromise.content.[]', function() {
    return (this.get('collectionPromise.content') || []).map((option) => {
      if (typeof option === 'object') {
        return option;
      } else {
        return {
          value:    option,
          label:    option,
          content:  option
        };
      }
    });
  }),

  init() {
    this._super(...arguments);
    this.elementId = this.get('inputElementId');
  },

  didInsertElement() {
    this._super(...arguments);
    // set default value in model
    this.nextRun = next(this, this.change);
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this.nextRun);
  },

  change: function() {
    let selected = Array.prototype.slice.call(this.element.querySelectorAll('option:checked'));
    this._setSelection(selected.map((el) => el.index));
  },

  _setSelection: function(indicies) {
    this.get('collectionPromise').then(() => {

      let newValues = A(A(this.get('resolvedCollection')).objectsAt(indicies)).mapBy('content');
      let value = this.get('value');

      if (isArray(value)) {
        A(value).replace(0, get(value, 'length'), newValues);
      } else {
        this.set('value', newValues[0]);
      }
    });
  },

  multiple: computed('value', function() {
    return isArray(this.get('value'));
  }),

  required: reads('config.validations.required')
}, ...['autocomplete', 'autofocus', 'collection', 'dir', 'disabled',
  'inputmode', 'inputElementId', 'name', 'pattern', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
));
