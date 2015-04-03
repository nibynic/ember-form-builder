import Ember from "ember";

export default Ember.Controller.extend({
  title: function() {
    return "test 123";
  }.property()
});
