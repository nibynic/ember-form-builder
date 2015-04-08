import Ember from "ember";

export default Ember.Component.extend({
  tagName: "option",
  attributeBindings: ["value", "isSelected:selected"],

  labelPathDidChange: function() {
    var labelPath = "content." + this.get("labelPath");

    Ember.defineProperty(this, "label", Ember.computed("content", labelPath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(labelPath);
      }
    }));
    this.notifyPropertyChange("label");
  }.observes("labelPath").on("init"),

  valuePathDidChange: function() {
    var valuePath = "content." + this.get("valuePath");

    Ember.defineProperty(this, "value", Ember.computed("content", valuePath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(valuePath);
      }
    }));
    this.notifyPropertyChange("value");
  }.observes("valuePath").on("init"),

  isSelected: function() {
    if (Ember.isArray(this.get("selectedValue"))) {
      return this.get("selectedValue").indexOf(this.get("value")) >= 0;
    } else {
      return this.get("selectedValue") === this.get("value");
    }
  }.property("selectedValue", "value")
});
