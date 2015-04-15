import Ember from "ember";

export default Ember.Component.extend({
  tagName: "select",
  attributeBindings: ["isMultiple:multiple"],
  isMultiple: false,
  collection: Ember.A(),
  optionValuePath: "id",
  optionLabelPath: "name",
  value: null,
  optionComponentName: "inputs/select-option",

  didInsertElement: function() {
    this.change();
  },

  change: function() {
    this._setSelection(this.$("option:selected").map(function() {
      return this.index;
    }).toArray());
  },

  _setSelection: function(indicies) {
    var selection = this.get("collection").objectsAt(indicies);
    var newValues = Ember.A(selection);

    if (Ember.isArray(this.get("value"))) {
      this.get("value").replace(0, this.get("value.length"), newValues);
    } else {
      this.set("value", newValues.get("firstObject"));
    }
  }
});
