import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import EmberObject, {
  defineProperty,
  computed
} from '@ember/object';
import { resolve } from 'rsvp';

@classic
export default class EmberValidations extends EmberObject {
  @computed('object')
  get attributes() {
    let object = this.object;
    return AttributesProxy.create({ object });
  }

  validate() {
    if (this.get('object.validate')) {
      return this.get('object').validate();
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
    return this.cache[key] = this.cache[key] || Attribute.create({
      key, object: this.object
    });
  }
}

@classic
class Attribute extends EmberObject {
  init() {
    undefined;
    defineProperty(this, 'validations', reads(`object.validations.${this.key}`));
    defineProperty(this, 'errors', reads(`object.errors.${this.key}`));
    defineProperty(this, 'warnings', reads(`object.warnings.${this.key}`));
  }

  @computed('validations.presence')
  get required() {
    return !!this.get('validations.presence');
  }

  @computed('validations.number.{integer,gt,gte,lt,lte,disabled}')
  get number() {
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
  }
}
