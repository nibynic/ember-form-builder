import { isArray } from '@ember/array';
import { defineProperty, computed, get } from '@ember/object';
import { assert } from '@ember/debug';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'option',
  attributeBindings: ['stringValue:value', 'isSelected:selected'],

  didReceiveAttrs() {
    this._super(...arguments);
    linkPath(this, 'label');
    linkPath(this, 'value');
    linkPath(this, 'stringValue', { to: 'value' });
  },

  isSelected: computed('selectedValue', 'selectedValue.[]', 'stringValue', 'stringValuePath', {
    set: function(key) {
      return this.get(key);
    },
    get: function() {
      var selectedValue = this.get('selectedValue');
      var value = this.get('stringValue');
      var path = this.get('stringValuePath');

      if (isArray(selectedValue)) {
        return selectedValue.map((v) => getPath(v, path)).indexOf(value) !== -1;
      } else {
        return getPath(selectedValue, path) === value;
      }
    }
  })
});

function linkPath(context, attrName, options = {}) {
  options.to = options.to || 'content';
  let path = context.get(`${attrName}Path`);

  assert(`${attrName}Path must begin with '${options.to}'`, path.match(`^${options.to}`));

  defineProperty(context, attrName, computed(path, function() {
    return getPath(this.get(options.to), path);
  }));
}

function getPath(content, path) {
  path = path.replace(/^(content|value).?/, '');
  if (typeof content === 'string' || path.length === 0) {
    return content;
  } else if (content) {
    return get(content, path);
  }
}
