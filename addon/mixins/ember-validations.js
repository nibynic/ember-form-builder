import Mixin from '@ember/object/mixin';
import { resolve } from 'rsvp';
import { get } from '@ember/object';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.errors.${attribute}`;
  },

  validationsPathFor(attribute) {
    return `object.validations.${attribute}`;
  },

  normalizeValidations(validations = {}) {
    return {
      required: !!get(validations, 'presence'),
      number: {
        integer:  !!get(validations, 'numericality.onlyInteger'),
        gt:       get(validations, 'numericality.greaterThan'),
        gte:      get(validations, 'numericality.greaterThanOrEqualTo'),
        lt:       get(validations, 'numericality.lessThan'),
        lte:      get(validations, 'numericality.lessThanOrEqualTo')
      }
    };
  },

  validateObject() {
    if (this.get("object.validate")) {
      return this.get("object").validate();
    } else {
      return resolve();
    }
  }
});
