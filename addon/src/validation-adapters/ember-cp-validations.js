import { resolve, reject } from 'rsvp';
import EmberObject from '@ember/object';

export default class EmberCpValidations extends EmberObject {
  cache = {};

  get attributes() {
    return new Proxy(this, {
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
  }

  validate() {
    if (this.object.validate) {
      return this.object.validate().then(({ validations }) => {
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
}

class Attribute {
  constructor(key, object) {
    this.key = key;
    this.object = object;
  }

  get config() {
    return (this.object.validations.attrs || {})[this.key] || {};
  }

  get validations() {
    return this.config.options || {};
  }

  get errors() {
    return this.config.messages || [];
  }

  get warnings() {
    return this.config.warningMessages || [];
  }

  get required() {
    return (
      this.validations.presence?.presence &&
      !this.validations.presence?.disabled
    );
  }

  get number() {
    if (!this.validations.number?.disabled) {
      return {
        integer: !!this.validations.number?.integer,
        gt: this.validations.number?.gt,
        gte: this.validations.number?.gte,
        lt: this.validations.number?.lt,
        lte: this.validations.number?.lte,
      };
    } else {
      return undefined;
    }
  }
}
