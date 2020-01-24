import Component from '@ember/component';
import layout from '../../templates/components/inputs/select-option';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  layout,

  tagName: 'option',
  attributeBindings: ['value', 'isSelected:selected'],

  label: reads('content.label'),
  value: reads('content.value'),

  isSelected: computed('selectedValue.[]', 'content.content', {
    set: function(key) {
      return this.get(key);
    },
    get: function() {
      let selectedValue = this.get('selectedValue');
      let content = this.get('content.content');
      if (isArray(selectedValue)) {
        return selectedValue.includes(content);
      } else {
        return selectedValue === content;
      }
    }
  })
});
