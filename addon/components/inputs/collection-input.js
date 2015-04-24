import Ember from "ember";

export default Ember.Component.extend({
  tagName: "select",
  attributeBindings: ["isMultiple:multiple"],
  isMultiple: false,
  collection: Ember.A(),
  optionValuePath: "content.id",
  optionLabelPath: "content.name",
  modelValue: null,
  value: Ember.computed.alias("modelValue"),
  optionComponentName: "inputs/select-option",

  didInsertElement: function() {
    if (Ember.isEmpty(this.get("value"))) {
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
    var newValues = Ember.A(selection.map(function(item) {
      if (typeof item === "string" || valuePath === "content") {
        return item;
      } else {
        return Ember.get(item, valuePath.replace(/^content\./, ""));
      }
    }));

    if (Ember.isArray(this.get("value"))) {
      this.get("value").replace(0, this.get("value.length"), newValues);
    } else {
      this.set("value", newValues.get("firstObject"));
    }
  }
});
