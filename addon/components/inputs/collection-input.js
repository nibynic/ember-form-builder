import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A, isArray } from '@ember/array';
import Component from '@ember/component';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";
import { reads } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend(InputDefaultsMixin, {
  tagName: "select",
  attributeBindings: ["isMultiple:multiple"],
  collection: null,
  optionValuePath: "content",
  optionStringValuePath: "value.id",
  optionLabelPath: "content.name",
  modelValue: null,
  optionComponentName: "inputs/select-option",

  collectionPromise: computed('collection', function() {
    let collection = this.get('collection');
    if (collection && collection.then) {
      return ObjectProxy.extend(PromiseProxyMixin).create({
        promise: collection
      });
    } else {
      return {
        content: collection
      };
    }
  }),

  resolvedCollection: reads('collectionPromise.content'),

  didInsertElement: function() {
    if (isEmpty(this.get('value'))) {
      scheduleOnce('afterRender', this, this.change);
    }
  },

  change: function() {
    let selected = Array.prototype.slice.call(this.element.querySelectorAll('option:checked'));
    this._setSelection(selected.map((el) => el.index));
  },

  _setSelection: function(indicies) {
    var selection = A(this.get("resolvedCollection")).objectsAt(indicies);
    var valuePath = this.get("optionValuePath");
    var newValues = A(selection.map(function(item) {
      if (typeof item === "string" || valuePath === "content") {
        return item;
      } else {
        return get(item, valuePath.replace(/^content\./, ""));
      }
    }));

    if (isArray(this.get("value"))) {
      A(this.get("value")).replace(0, this.get("value.length"), newValues);
    } else {
      this.set("value", newValues.get("firstObject"));
    }
  },

  isMultiple: computed('modelValue', function() {
    return isArray(this.get('modelValue'));
  })
});
