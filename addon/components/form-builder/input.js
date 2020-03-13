import Component from '@ember/component';
import layout from '../../templates/components/form-builder/input';
import { isPresent } from '@ember/utils';
import { alias, reads } from '@ember/object/computed';
import EmberObject, {
  computed,
  defineProperty
} from '@ember/object';
import { inject as service } from '@ember/service';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import byDefault from 'ember-form-builder/utilities/by-default';
import { once } from '@ember/runloop';
import { A } from '@ember/array';

export default Component.extend({
  layout,

  'data-test-input-type': reads('type'),
  'data-test-input-name': reads('name'),

  translationService: service("formBuilderTranslations"),
  hasFocusedOut: false,
  as: byDefault("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  }),
  attr: null,

  type:           reads('as'),
  wrapper:        'default',
  object:         reads('builder.object'),
  _model:         reads('builder.model'),
  modelName:      reads('builder.modelName'),
  configuration:  reads('builder.configuration'),

  builder: computed({
    set(key, value) {
      if (value && value.builder) {
        return value.builder;
      } else {
        return value;
      }
    }
  }),

  focusOut() {
    once(this, this.set, 'hasFocusedOut', true);
  },

  canValidate: byDefault('hasFocusedOut', 'builder.isValid', function() {
    return this.get('hasFocusedOut') || !this.get('builder.isValid');
  }),

  init() {
    this._super(...arguments);

    defineProperty(this, 'validations', reads(`builder.validationAdapter.attributes.${this.get('attr')}`));

    var valueAttribute = "object." + this.get("attr");
    defineProperty(this, "value", computed(valueAttribute, {
      get: function() {
        return this.get(valueAttribute);
      },
      set: function(key, value) {
        this.set(valueAttribute, value);
        return value;
      }
    }));
  },

  config: computed(function() {
    let attrs = A(
      Object.keys(this.get('attrs')).concat([
        'inputElementId', 'name', 'type', 'value', 'texts', 'validations',
        'canValidate', 'disabled:combinedDisabled'
      ])
    ).removeObjects(['attr', 'builder', 'as', 'label', 'placeholder', 'hint']);
    return EmberObject.extend(
      ...attrs.map((key) => key.split(':').length > 1 ?
        {
          [key.split(':')[0]]: alias(`content.${key.split(':')[1]}`)
        } : {
          [key]: alias(`content.${key}`)
        }
      )
    ).create({ content: this });
  }),

  texts: computed(function() {
    return TextProxy.create({ content: this });
  }),

  inputElementId: byDefault(function() {
    return this.get("elementId") + "Input";
  }),

  name: computed('builder.name', 'attr', function() {
    var prefix = this.get('builder.name');
    var name = this.get('attr');
    if (isPresent(prefix)) {
      name = prefix + '[' + name + ']';
    }
    return name;
  }),

  combinedDisabled: computed('builder.isLoading', 'disabled', function() {
    return !!this.get('builder.isLoading') || !!this.get('disabled');
  })
}).reopenClass({
  positionalParams: ["attr"]
});

const TextProxy = EmberObject.extend({
  humanizedAttributes: Object.freeze(['label']),
  typeMapping: Object.freeze({ label: 'attribute' }),

  unknownProperty(key) {
    defineProperty(this, key, computed(`content.{${key},attr,translationService.locale,builder.translationKey}`, function() {
      let originalValue = this.get(`content.${key}`);
      let attr = this.get('content.attr');
      let mappedKey = this.get('typeMapping')[key] || key;
      if (originalValue !== false) {
        return originalValue || this.get('content.translationService').t(
          this.get('content.builder.translationKey'), mappedKey, attr
        ) || (
          this.get('humanizedAttributes').includes(key) ? humanize(attr) : undefined
        );
      } else {
        return undefined;
      }
    }));
    return this.get(key);
  }
});
