import { resolve, reject } from 'rsvp';
import EmberObject from '@ember/object';
import compatibleProxy from '../utils/compatible-proxy';

export default class EmberCpValidations extends EmberObject {
  cache = {};

  get attributes() {
    return compatibleProxy(this, function (source, key) {
      if (key in this || typeof key === 'symbol') {
        return this[key];
      }
      source.cache[key] =
        source.cache[key] || new Attribute(key, source.object);
      return source.cache[key];
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
