import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

export default class EmberValidations extends EmberObject {
  cache = {};
  attributes = new Proxy(this, {
    get(self, key) {
      if (key in self || typeof key === 'symbol') {
        return self[key];
      }
      self.cache[key] = self.cache[key] || new Attribute(key, self.object);
      return self.cache[key];
    },
    has() {
      return true;
    },
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
