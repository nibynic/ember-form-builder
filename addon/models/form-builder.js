import Ember from "ember";

export default Ember.Object.extend({
  name: function(key, value, previousValue) {
    var newValue = previousValue;

    if (arguments.length > 1) {
      newValue = value;
    }

    if (Ember.isEmpty(newValue)) {
      newValue = this.get("object.constructor");
    }

    return newValue;
  }.property()
});
