import Ember from "ember";

export default Ember.Component.extend({
  tagName: "option",
  attributeBindings: ["value", "isSelected:selected"],

  init: function() {
    this._super();
    this.labelPathDidChange();
    this.valuePathDidChange();
  },

  labelPathDidChange: Ember.observer("labelPath", function() {
    var labelPath = "content." + this.get("labelPath");

    Ember.defineProperty(this, "label", Ember.computed("content", labelPath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(labelPath);
      }
    }));
    this.notifyPropertyChange("label");
  }),

  valuePathDidChange: Ember.observer("valuePath", function() {
    var valuePath = "content." + this.get("valuePath");

    Ember.defineProperty(this, "value", Ember.computed("content", valuePath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(valuePath);
      }
    }));
    this.notifyPropertyChange("value");

    Ember.defineProperty(this, "isSelected", Ember.computed("selectedValue", "value", function() {
      var selectedValue = this.get("selectedValue");

      if (Ember.isEmpty(selectedValue)) {
        selectedValue = Ember.A();
      } else if (!Ember.isArray(selectedValue)) {
        selectedValue = Ember.A([selectedValue]);
      }

      if (Ember.isPresent(this.get("valuePath"))) {
        selectedValue = selectedValue.mapBy(this.get("valuePath"));
      }

      return selectedValue.indexOf(this.get("value")) >= 0;
    }));
    this.notifyPropertyChange("isSelected");
  })
});
