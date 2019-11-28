import Mixin from '@ember/object/mixin';
import { resolve, reject } from 'rsvp';
import EmberObject, { computed } from '@ember/object';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.messages`;
  },

  validationsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.options`;
  },

  normalizeValidations(validations = {}) {
    return ValidationsMapper.create({ validations });
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

const ValidationsMapper = EmberObject.extend({
  required: computed('validations.presence.presence', function() {
    return this.get('validations.presence.presence') && !this.get('validations.presence.disabled');
  }),

  number: computed('validations.number{integer,gt,gte,lt,lte,disabled}', function() {
    if (this.get('validations.number.integer') && !this.get('validations.number.disabled')) {
      return {
        integer:  !!this.get('validations.number.integer'),
        gt:       this.get('validations.number.gt'),
        gte:      this.get('validations.number.gte'),
        lt:       this.get('validations.number.lt'),
        lte:      this.get('validations.number.lte')
      }
    } else {
      return undefined;
    }
  })
});
