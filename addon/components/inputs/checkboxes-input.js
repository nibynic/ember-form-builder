import Ember from "ember";
import CollectionInput from "ember-simple-form/components/inputs/collection-input";

export default CollectionInput.extend({
  tagName: "div",
  optionComponentName: "inputs/checkbox-option",
  change: function() {},

  actions: {
    selectValue: function(value) {
      if (Ember.isArray(this.get("value"))) {
        if (this.get("value").indexOf(value) > -1) {
          this.get("value").removeObject(value);
        } else {
          this.get("value").addObject(value);
        }
      } else {
        this.set("value", value);
      }
    }
  },

  inputType: Ember.computed("isMultiple", function() {
    return this.get("isMultiple") ? "checkbox" : "radio";
  }),

  inputName: Ember.computed("elementId", function() {
    return this.get("elementId") + "-radio";
  })
});
