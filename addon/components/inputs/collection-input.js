import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A, isArray } from '@ember/array';
import { computed } from '@ember/object';
import Component from '@ember/component';
import InputDefaultsMixin from "ember-form-builder/mixins/input-defaults";

export default Component.extend(InputDefaultsMixin, {
  tagName: "select",
  attributeBindings: ["isMultiple:multiple"],
  isMultiple: false,
  collection: A(),
  optionValuePath: "content.id",
  optionLabelPath: "content.name",
  modelValue: null,
  optionComponentName: "inputs/select-option",

  resolvedCollection: computed("collection.content", {
    get() {
      if (this.get("collection") && this.get("collection").then) {
        this.get("collection").then((result) => {
          this.set("resolvedCollection", result);
        });
        return A();
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
    var selection = this.get("collection").objectsAt(indicies);
    var valuePath = this.get("optionValuePath");
    var newValues = A(selection.map(function(item) {
      if (typeof item === "string" || valuePath === "content") {
        return item;
      } else {
        return get(item, valuePath.replace(/^content\./, ""));
      }
    }));

    if (isArray(this.get("value"))) {
      this.get("value").replace(0, this.get("value.length"), newValues);
    } else {
      this.set("value", newValues.get("firstObject"));
    }
  }
});
