import EmberObject, { computed, defineProperty } from '@ember/object';
import { reads } from '@ember/object/computed';
import { resolve } from 'rsvp';

export default EmberObject.extend({
  attributes: computed('object', function() {
    let object = this.object;
    return AttributesProxy.create({ object });
  }),

  validate() {
    if (this.get('object.validate')) {
      return this.get('object').validate();
    } else {
      return resolve();
    }
  }
});

const AttributesProxy = EmberObject.extend({
  cache: computed(function() {
    return {};
  }),

  unknownProperty(key) {
    return this.cache[key] = this.cache[key] || Attribute.create({
      key, object: this.object
    });
  }
});

const Attribute = EmberObject.extend({
  init() {
    this._super(...arguments);
    defineProperty(this, 'validations', reads(`object.validations.${this.key}`));
    defineProperty(this, 'errors', reads(`object.errors.${this.key}`));
    defineProperty(this, 'warnings', reads(`object.warnings.${this.key}`));
  },

  required: computed('validations.presence', function() {
    return !!this.get('validations.presence');
  }),

  number: computed('validations.number.{integer,gt,gte,lt,lte,disabled}', function() {
    if (this.get('validations.numericality')) {
      return {
        integer:  !!this.get('validations.numericality.onlyInteger'),
        gt:       this.get('validations.numericality.greaterThan'),
        gte:      this.get('validations.numericality.greaterThanOrEqualTo'),
        lt:       this.get('validations.numericality.lessThan'),
        lte:      this.get('validations.numericality.lessThanOrEqualTo')
      };
    } else {
      return undefined;
    }
  })
});
