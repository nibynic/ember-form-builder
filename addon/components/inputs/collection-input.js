import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A, isArray } from '@ember/array';
import Component from '@ember/component';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default Component.extend(InputDefaultsMixin, {
  tagName: "select",
  attributeBindings: ["isMultiple:multiple"],
  collection: null,
  optionValuePath: "content",
  optionValueAttrPath: "content.id",
  optionLabelPath: "content.name",
  modelValue: null,
  optionComponentName: "inputs/select-option",

  resolvedCollection: computed("collection.content", {
    get() {
      if (this.get("collection") && this.get("collection").then) {
        this.get("collection").then((result) => {
          this.set("resolvedCollection", result);
        });
        return [];
      } else {
        return this.get("collection");
      }
    },
    set(key, value) {
      return value;
    }
  }),

  didInsertElement: function() {
    if (isEmpty(this.get("value"))) {
      this.change();
    }
  },

  change: function() {
    this._setSelection(this.$("option:selected").map(function() {
      return this.index;
    }).toArray());
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
