import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import SelectOption from "ember-form-builder/components/inputs/select-option";

export default SelectOption.extend({
  tagName: "div",
  attributeBindings: [],

  isChecked: alias("isSelected"),

  inputElementId: computed("elementId", function() {
    return this.get("elementId") + "-input";
  })
});
