import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import compatibleProxy from '../utils/compatible-proxy';

export default class EmberValidations extends EmberObject {
  cache = {};
  attributes = compatibleProxy(this, function (source, key) {
    if (key in this || typeof key === 'symbol') {
      return this[key];
    }
    source.cache[key] = source.cache[key] || new Attribute(key, source.object);
    return source.cache[key];
  });

  validate() {
    if (this.object.validate) {
      return this.object.validate();
    } else {
      return resolve();
    }
  }
}

class Attribute {
  constructor(key, object) {
    this.key = key;
    this.object = object;
  }

  get validations() {
    return (this.object.validations || {})[this.key] || {};
  }

  get errors() {
    return (this.object.errors || {})[this.key] || [];
  }

  get warnings() {
    return (this.object.warnings || {})[this.key] || [];
  }

  get required() {
    return !!this.validations.presence;
  }

  get number() {
    if (this.validations.numericality) {
      return {
        integer: !!this.validations.numericality.onlyInteger,
        gt: this.validations.numericality.greaterThan,
        gte: this.validations.numericality.greaterThanOrEqualTo,
        lt: this.validations.numericality.lessThan,
        lte: this.validations.numericality.lessThanOrEqualTo,
      };
    } else {
      return undefined;
    }
  }
}
