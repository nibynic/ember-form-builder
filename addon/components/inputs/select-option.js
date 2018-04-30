import { isArray } from '@ember/array';
import { observer, defineProperty, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: "option",
  attributeBindings: ["value", "isSelected:selected"],

  init: function() {
    this._super();
    this.labelPathDidChange();
    this.valuePathDidChange();
  },

  labelPathDidChange: observer("labelPath", function() {
    var labelPath = this.get("labelPath");

    defineProperty(this, "label", computed("content", labelPath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(labelPath);
      }
    }));
    this.notifyPropertyChange("label");
  }),

  valuePathDidChange: observer("valuePath", function() {
    var valuePath = this.get("valuePath");

    defineProperty(this, "value", computed("content", valuePath, function() {
      if (typeof this.get("content") === "string") {
        return this.get("content");
      } else {
        return this.get(valuePath);
      }
    }));
    this.notifyPropertyChange("value");

    defineProperty(this, "isSelected", computed("selectedValue", "selectedValue.[]", "value", {
      set: function(key) {
        return this.get(key);
      },
      get: function() {
        var selectedValue = this.get("selectedValue.content") || this.get("selectedValue");
        var value = this.get("value.content") || this.get("value");

        if (isArray(selectedValue)) {
          return selectedValue.indexOf(value) > -1;
        } else if (!isArray(selectedValue)) {
          return selectedValue === value;
        }
      }
    }));
    this.notifyPropertyChange("isSelected");
  })
});
