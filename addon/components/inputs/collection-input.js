import Component from '@ember/component';
import layout from '../../templates/components/inputs/collection-input';
import { get, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import { reads, alias, or } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { next, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';

export default Component.extend({
  layout,

  tagName: 'select',
  attributeBindings: ['autocomplete', 'autofocus', 'dir', 'disabled', 'inputmode',
    'multiple', 'name', 'pattern', 'placeholder', 'required', 'size', 'tabindex'],

  defaults: Object.freeze({
    optionValuePath:        'content',
    optionStringValuePath:  'value.id',
    optionLabelPath:        'content.name'
  }),

  optionValuePath:        or('config.optionValuePath', 'defaults.optionValuePath'),
  optionStringValuePath:  or('config.optionStringValuePath', 'defaults.optionStringValuePath'),
  optionLabelPath:        or('config.optionLabelPath', 'defaults.optionLabelPath'),

  optionComponentName: "inputs/select-option",

  value: alias('config.value'),

  collectionPromise: computed('collection', function() {
    return ObjectProxy.extend(PromiseProxyMixin).create({
      promise: resolve(this.get('collection'))
    });
  }),

  resolvedCollection: reads('collectionPromise.content'),

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
    this.get('collectionPromise').then((collection) => {
      var selection = A(collection).objectsAt(indicies);
      var valuePath = this.get("optionValuePath");
      var newValues = A(selection.map(function(item) {
        if (typeof item === "string" || valuePath === "content") {
          return item;
        } else if (item) {
          return get(item, valuePath.replace(/^content\./, ""));
        } else {
          return item;
        }
      }));

      if (isArray(this.get("value"))) {
        A(this.get("value")).replace(0, this.get("value.length"), newValues);
      } else {
        this.set("value", newValues.get("firstObject"));
      }
    });
  },

  multiple: computed('value', function() {
    return isArray(this.get('value'));
  }),

  required: reads('config.validations.required')
}, ...['autocomplete', 'autofocus', 'collection', 'dir', 'disabled',
  'inputmode', 'inputElementId', 'name', 'pattern', 'placeholder', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
));
