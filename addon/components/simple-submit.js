import Ember from "ember";

export default Ember.Component.extend({
  tagName: "button",
  type: "submit",
  attributeBindings: ["type"]
});
