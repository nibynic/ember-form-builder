import classic from 'ember-classic-decorator';
import { layout as templateLayout } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { reads, alias } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/form-builder/input';
import { isPresent } from '@ember/utils';
import EmberObject, {
  defineProperty,
  computed
} from '@ember/object';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import byDefault from 'ember-form-builder/utilities/by-default';
import { once } from '@ember/runloop';
import { A } from '@ember/array';

@classic
@templateLayout(layout)
export default class Input extends Component {
  @reads('type')
  'data-test-input-type';

  @reads('name')
  'data-test-input-name';

  @service("formBuilderTranslations")
  translationService;

  hasFocusedOut = false;

  @byDefault("_model", "attr", function() {
    return guessType(this.get("_model"), this.get("attr"), this);
  })
  as;

  attr = null;

  @reads('as')
  type;

  wrapper = 'default';

  @reads('builder.object')
  object;

  @reads('builder.model')
  _model;

  @reads('builder.modelName')
  modelName;

  @reads('builder.configuration')
  configuration;

  @computed
  get builder() {
    return this._builder;
  }
  set builder(value) {
    if (value && value.builder) {
      return this._builder = value.builder;
    } else {
      return this._builder = value;
    }
  }

  focusOut() {
    once(this, this.set, 'hasFocusedOut', true);
  }

  @byDefault('hasFocusedOut', 'builder.isValid', function() {
    return this.get('hasFocusedOut') || !this.get('builder.isValid');
  })
  canValidate;

  init() {
    super.init(...arguments);

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
  }

  @computed
  get config() {
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
  }

  @computed
  get texts() {
    return TextProxy.create({ content: this });
  }

  @byDefault(function() {
    return this.get("elementId") + "Input";
  })
  inputElementId;

  @computed('builder.name', 'attr')
  get name() {
    var prefix = this.get('builder.name');
    var name = this.get('attr');
    if (isPresent(prefix)) {
      name = prefix + '[' + name + ']';
    }
    return name;
  }

  @computed('builder.isLoading', 'disabled')
  get combinedDisabled() {
    return !!this.get('builder.isLoading') || !!this.get('disabled');
  }
}


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
