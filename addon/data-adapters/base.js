import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  isModel() {},

  model: computed('object.model', function() {
    return this.isModel(this.get('object.model')) ?
      this.get('object.model') :
      this.get('object');
  })
});
