import Ember from "ember";
import SelectOption from "ember-simple-form/components/inputs/select-option";

export default SelectOption.extend({
  tagName: "div",
  attributeBindings: [],

  change: function() {
    this.sendAction("action", this.get("value"));
  },

  isChecked: Ember.computed("selectedValue", "value", function() {
    return this.get("selectedValue") === this.get("value");
  }),

  inputElementId: Ember.computed("elementId", function() {
    return this.get("elementId") + "-input";
  })
});
