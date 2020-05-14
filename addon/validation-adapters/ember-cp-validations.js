import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import { resolve, reject } from 'rsvp';
import EmberObject, {
  defineProperty,
  computed,
  get
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
    return this.cache[key] = this.cache[key] || new Attribute(key, this.object);
  }
}

class Attribute {
  constructor(key, object) {
    this.object = object;
    defineProperty(this, 'validations', reads(`object.validations.attrs.${key}.options`));
    defineProperty(this, 'errors', reads(`object.validations.attrs.${key}.messages`));
    defineProperty(this, 'warnings', reads(`object.validations.attrs.${key}.warningMessages`));
  }

  @computed('validations.presence.{presence,disabled}')
  get required() {
    return get(this, 'validations.presence.presence') && !get(this, 'validations.presence.disabled');
  }

  @computed('validations.number.{integer,gt,gte,lt,lte,disabled}')
  get number() {
    if (get(this, 'validations.number.integer') && !get(this, 'validations.number.disabled')) {
      return {
        integer:  !!get(this, 'validations.number.integer'),
        gt:       get(this, 'validations.number.gt'),
        gte:      get(this, 'validations.number.gte'),
        lt:       get(this, 'validations.number.lt'),
        lte:      get(this, 'validations.number.lte')
      }
    } else {
      return undefined;
    }
  }
}
