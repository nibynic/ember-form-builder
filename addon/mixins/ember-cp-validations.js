import Mixin from '@ember/object/mixin';
import { resolve, reject } from 'rsvp';
import { get } from '@ember/object';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.messages`;
  },

  validationsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.options`;
  },

  normalizeValidations(validations = {}) {
    return {
      required: !!get(validations, 'presence.presence'),
      number: {
        integer:  !!get(validations, 'number.integer'),
        gt:       get(validations, 'number.gt'),
        gte:      get(validations, 'number.gte'),
        lt:       get(validations, 'number.lt'),
        lte:      get(validations, 'number.lte')
      }
    };
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
