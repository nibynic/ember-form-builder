import Mixin from '@ember/object/mixin';
import { resolve, reject } from 'rsvp';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.messages`;
  },

  validateObject() {
    if (this.get('object.validate')) {
      return this.get('object').validate().then(({ validations }) => {
        if (validations.isValid) {
          return resolve();
        } else {
          return reject();
        }
      });
    } else {
      return resolve();
    }
  }
});
