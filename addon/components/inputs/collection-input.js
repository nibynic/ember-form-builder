import { get, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import Component from '@ember/component';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";
import { reads } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { next, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';

export default Component.extend(InputDefaultsMixin, {
  tagName: "select",
  attributeBindings: ["isMultiple:multiple", "name"],
  collection: null,
  optionValuePath: "content",
  optionStringValuePath: "value.id",
  optionLabelPath: "content.name",
  modelValue: null,
  optionComponentName: "inputs/select-option",

  collectionPromise: computed('collection', function() {
    return ObjectProxy.extend(PromiseProxyMixin).create({
      promise: resolve(this.get('collection'))
    });
  }),

  resolvedCollection: reads('collectionPromise.content'),

  didInsertElement: function() {
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

  isMultiple: computed('modelValue', function() {
    return isArray(this.get('modelValue'));
  })
});
