import CollectionInput from 'ember-form-builder/components/inputs/collection-input';
import layout from '../../templates/components/inputs/checkboxes-input';
import { computed } from '@ember/object';
import byDefault from 'ember-form-builder/utilities/by-default';

export default CollectionInput.extend({
  layout,

  tagName: 'div',
  optionComponentName: 'inputs/checkbox-option',

  change() {
    var indices = [];
    this.element.querySelectorAll('input').forEach(function(input, i) {
      if(input.checked) {
        indices.push(i);
      }
    });
    this._setSelection(indices);
  },

  inputType: computed('multiple', function() {
    return this.get('multiple') ? 'checkbox' : 'radio';
  }),

  inputName: byDefault('config.elementId', function() {
    return this.get('config.elementId') + '-radio';
  })
});
