import SelectOption from 'ember-form-builder/components/inputs/select-option';
import layout from '../../templates/components/inputs/checkbox-option';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default SelectOption.extend({
  layout,
  
  tagName: "div",
  attributeBindings: [],

  isChecked: alias("isSelected"),

  inputElementId: computed("elementId", function() {
    return this.get("elementId") + "-input";
  })
});
