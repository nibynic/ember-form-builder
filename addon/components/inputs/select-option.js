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
    var labelPath = this.get("labelPath");

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
    var valuePath = this.get("valuePath");

    Ember.defineProperty(this, "value", Ember.computed("content", valuePath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(valuePath);
      }
    }));
    this.notifyPropertyChange("value");

    Ember.defineProperty(this, "isSelected", Ember.computed("selectedValue", "value", {
      set: function(key) {
        return this.get(key);
      },
      get: function() {
        var selectedValue = this.get("selectedValue");
      
        if (Ember.isArray(selectedValue)) {
          return selectedValue.indexOf(this.get("value")) > -1;
        } else if (!Ember.isArray(selectedValue)) {
          return selectedValue === this.get("value");
        }
      }
    }));
    this.notifyPropertyChange("isSelected");
  })
});
