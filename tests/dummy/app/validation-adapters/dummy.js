import EmberObject from '@ember/object';
import { reads } from '@ember/object/computed';

export default EmberObject.extend({
  validate() {
    return this.object.validate();
  },

  attributes: reads('object.validationsDummy')
})
