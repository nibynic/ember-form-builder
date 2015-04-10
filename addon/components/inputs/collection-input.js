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
  // concatenatedClassNames: function() {
  //   return this.get("classNames").join(" ");
  // }.property("classNames")

  didInsertElement: function() {
    this.change();
  },

  change: function() {
    this._setSelection(this.$("option:selected").map(function() {
      return this.index;
    }).toArray());
  },

  _setSelection: function(indicies) {
    // if (!Ember.isArray(value)) {
    //   value = [value];
    // }
    //
    var selection = this.get("collection").objectsAt(indicies);
    var valuePath = this.get("optionValuePath");
    var newValues = Ember.A(selection.map(function(item) {
      if (typeof item === "string") {
        return item;
      } else {
        return Ember.get(item, valuePath);
      }
    }));

    if (Ember.isArray(this.get("value"))) {
      this.get("value").replace(0, this.get("value.length"), newValues);
    } else {
      this.set("value", newValues.get("firstObject"));
    }
  }
});
