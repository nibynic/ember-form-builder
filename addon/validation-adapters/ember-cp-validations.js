import { resolve, reject } from 'rsvp';
import EmberObject, {
  computed,
  defineProperty
} from '@ember/object';
import { reads } from '@ember/object/computed';

export default EmberObject.extend({
  attributes: computed('object', function() {
    let object = this.object;
    return AttributesProxy.create({ object });
  }),

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
    defineProperty(this, 'validations', reads(`object.validations.attrs.${this.key}.options`));
    defineProperty(this, 'errors', reads(`object.validations.attrs.${this.key}.messages`));
    defineProperty(this, 'warnings', reads(`object.validations.attrs.${this.key}.warningMessages`));
  },

  required: computed('validations.presence.{presence,disabled}', function() {
    return this.get('validations.presence.presence') && !this.get('validations.presence.disabled');
  }),

  number: computed('validations.number.{integer,gt,gte,lt,lte,disabled}', function() {
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
