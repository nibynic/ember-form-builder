import Mixin from '@ember/object/mixin';
import { resolve } from 'rsvp';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.errors.${attribute}`;
  },

  validateObject() {
    if (this.get("object.validate")) {
      return this.get("object").validate();
    } else {
      return resolve();
    }
  }
});
