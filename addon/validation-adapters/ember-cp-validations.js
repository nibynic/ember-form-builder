import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import { resolve, reject } from 'rsvp';
import EmberObject, {
  defineProperty,
  computed
} from '@ember/object';

@classic
export default class EmberCpValidations extends EmberObject {
  @computed('object')
  get attributes() {
    let object = this.object;
    return AttributesProxy.create({ object });
  }

  validate() {
    if (this.get('object.validate')) {
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
    defineProperty(this, 'validations', reads(`object.validations.attrs.${this.key}.options`));
    defineProperty(this, 'errors', reads(`object.validations.attrs.${this.key}.messages`));
    defineProperty(this, 'warnings', reads(`object.validations.attrs.${this.key}.warningMessages`));
  }

  @computed('validations.presence.{presence,disabled}')
  get required() {
    return this.get('validations.presence.presence') && !this.get('validations.presence.disabled');
  }

  @computed('validations.number.{integer,gt,gte,lt,lte,disabled}')
  get number() {
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
  }
}
