import Ember from "ember";
import findModel from "ember-simple-form/utilities/find-model";

export default Ember.Object.extend({
  name: Ember.computed(function(key, value, previousValue) {
    var newValue = previousValue;

    if (arguments.length > 1) {
      newValue = value;
    }

    if (Ember.isEmpty(newValue)) {
      newValue = this.get("object.constructor");
    }

    return newValue;
  }),

  model: Ember.computed("object", function() {
    return findModel(this.get("object"));
  })
});
