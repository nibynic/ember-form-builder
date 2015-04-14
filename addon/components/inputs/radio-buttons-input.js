import Ember from "ember";
import CollectionInput from "ember-simple-form/components/inputs/collection-input";

export default CollectionInput.extend({
  tagName: "div",
  isMultipile: false,
  optionComponentName: "inputs/radio-button-option",
  change: function() {},

  actions: {
    selectValue: function(value) {
      this.set("value", value);
    }
  },

  inputName: Ember.computed("elementId", function() {
    return this.get("elementId") + "-radio";
  })
});
