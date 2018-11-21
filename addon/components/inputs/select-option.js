import { isArray } from '@ember/array';
import { observer, defineProperty, computed, get } from '@ember/object';
import { assert } from '@ember/debug';
import Component from '@ember/component';

export default Component.extend({
  tagName: "option",
  attributeBindings: ["stringValue:value", "isSelected:selected"],

  init: function() {
    this._super();
    this.labelPathDidChange();
    this.valuePathDidChange();
    this.stringValuePathDidChange();
  },

  labelPathDidChange: observer("labelPath", function() {
    var labelPath = this.get("labelPath");
    assert('labelPath must begin with `content`', labelPath.match(/^content/));

    defineProperty(this, "label", computed("content", labelPath, function() {
      return getPath(this.get('content'), labelPath);
    }));
    this.notifyPropertyChange("label");
  }),

  valuePathDidChange: observer("valuePath", function() {
    var valuePath = this.get("valuePath");
    assert('valuePath must begin with `content`', valuePath.match(/^content/));

    defineProperty(this, "value", computed("content", valuePath, function() {
      return getPath(this.get('content'), valuePath);
    }));
    this.notifyPropertyChange("value");
  }),

  stringValuePathDidChange: observer("stringValuePath", function() {
    var stringValuePath = this.get("stringValuePath");
    assert('stringValuePath must begin with `value`', stringValuePath.match(/^value/));

    defineProperty(this, "stringValue", computed(stringValuePath, function() {
      return getPath(this.get('value'), stringValuePath);
    }));
    this.notifyPropertyChange("stringValue");

    defineProperty(this, "isSelected", computed("selectedValue", "selectedValue.[]", "stringValue", "stringValuePath", {
      set: function(key) {
        return this.get(key);
      },
      get: function() {
        var selectedValue = this.get("selectedValue");
        var value = this.get("stringValue");
        var path = this.get("stringValuePath");

        if (isArray(selectedValue)) {
          return selectedValue.map((v) => getPath(v, path)).indexOf(value) !== -1;
        } else {
          return getPath(selectedValue, path) === value;
        }
      }
    }));
    this.notifyPropertyChange("isSelected");
  })
});

function getPath(content, path) {
  path = path.replace(/^(content|value).?/, '');
  if (typeof content === "string" || path.length === 0) {
    return content;
  } else if (content) {
    return get(content, path);
  }
}
