import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import EmberObject, { defineProperty, computed, get } from '@ember/object';
import { resolve } from 'rsvp';

@classic
export default class EmberValidations extends EmberObject {
  @computed('object')
  get attributes() {
    let object = this.object;
    return AttributesProxy.create({ object });
  }

  validate() {
    if (get(this, 'object.validate')) {
      return get(this, 'object').validate();
    } else {
      return resolve();
    }
  }
}

@classic
class AttributesProxy extends EmberObject {
  @computed
  get cache() {
    return {};
  }

  unknownProperty(key) {
    return (this.cache[key] =
      this.cache[key] || new Attribute(key, this.object));
  }
}

@classic
class Attribute {
  constructor(key, object) {
    this.object = object;
    defineProperty(this, 'validations', reads(`object.validations.${key}`));
    defineProperty(this, 'errors', reads(`object.errors.${key}`));
    defineProperty(this, 'warnings', reads(`object.warnings.${key}`));
  }

  @computed('validations.presence')
  get required() {
    return !!get(this, 'validations.presence');
  }

  @computed(
    'validations.numericality.{onlyInteger,greaterThan,greaterThanOrEqualTo,lessThan,lessThanOrEqualTo}'
  )
  get number() {
    if (get(this, 'validations.numericality')) {
      return {
        integer: !!get(this, 'validations.numericality.onlyInteger'),
        gt: get(this, 'validations.numericality.greaterThan'),
        gte: get(this, 'validations.numericality.greaterThanOrEqualTo'),
        lt: get(this, 'validations.numericality.lessThan'),
        lte: get(this, 'validations.numericality.lessThanOrEqualTo'),
      };
    } else {
      return undefined;
    }
  }
}
