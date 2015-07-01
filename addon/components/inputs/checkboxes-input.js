import Ember from "ember";
import CollectionInput from "ember-simple-form/components/inputs/collection-input";

export default CollectionInput.extend({
  tagName: "div",
  optionComponentName: "inputs/checkbox-option",
  
  change: function() {
    var indices = [];
    this.$("input").each( function(i, input) {
      if(input.checked) {
        indices.push(i);
      }
    });
    this._setSelection(indices);
  },

  inputType: Ember.computed("isMultiple", function() {
    return this.get("isMultiple") ? "checkbox" : "radio";
  }),

  inputName: Ember.computed("elementId", function() {
    return this.get("elementId") + "-radio";
  })
});
