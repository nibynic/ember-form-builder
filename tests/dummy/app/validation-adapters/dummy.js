import EmberObject from '@ember/object';

export default EmberObject.extend({
  validate() {
    return this.object.validate();
  }
})
