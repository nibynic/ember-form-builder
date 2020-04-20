import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { reads, alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import EmberObject, {
  defineProperty,
  computed,
  action
} from '@ember/object';
import humanize from "ember-form-builder/utilities/humanize";
import guessType from "ember-form-builder/utilities/guess-type";
import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';

export default class Input extends Component {

  @service("formBuilderTranslations")
  translationService;

  @tracked
  hasFocusedOut = false;

  get type() {
    return this.args.as || guessType(this._model, this.args);
  }

  attr = null;

  get wrapper() {
    return this.args.wrapper || 'default';
  }

  @reads('builder.object')
  object;

  @reads('builder.model')
  _model;

  @reads('builder.modelName')
  modelName;

  @reads('builder.configuration')
  configuration;

  get builder() {
    let builder = this.args.builder;
    return (builder && builder.builder) || builder;
  }

  @action
  handleFocusOut() {
    this.hasFocusedOut = true;
  }


  @computed('hasFocusedOut', 'builder.isValid')
  get canValidate() {
    return this.hasFocusedOut || !this.builder.isValid;
  }

  constructor() {
    super(...arguments);
    defineProperty(this, 'value', alias(`builder.object.${this.args.attr}`))
    defineProperty(this, 'validations', alias(`builder.validationAdapter.attributes.${this.args.attr}`))
  }

  @computed
  get config() {
    let attrs = A(
      Object.keys(this.args).map(
        (key) => `args.${key}`
      ).concat([
        'inputElementId', 'name', 'type', 'value', 'texts', 'validations',
        'canValidate', 'disabled'
      ])
    ).removeObjects(['attr', 'builder', 'as', 'label', 'placeholder', 'hint']);
    return EmberObject.extend(
      ...attrs.map((key) => ({
          [key.split('.').reverse()[0]]: alias(`content.${key}`)
        })
      )
    ).create({ content: this });
  }

  @computed
  get texts() {
    return TextProxy.create({ content: this.args, translationService: this.translationService });
  }

  get inputElementId() {
    return this.args.inputElementId || `${guidFor(this)}Input`;
  }

  @computed('builder.name', 'args.attr')
  get name() {
    var prefix = this.builder.name;
    var name = this.args.attr;
    if (isPresent(prefix)) {
      name = prefix + '[' + name + ']';
    }
    return name;
  }

  @computed('builder.isLoading', 'args.disabled')
  get disabled() {
    return !!this.builder.isLoading || !!this.args.disabled;
  }
}


const TextProxy = EmberObject.extend({
  humanizedAttributes: Object.freeze(['label']),
  typeMapping: Object.freeze({ label: 'attribute' }),
  translationService: null,

  unknownProperty(key) {
    defineProperty(this, key, computed(`content.{${key},attr,builder.translationKey}`, 'translationService.locale', function() {
      let originalValue = this.get(`content.${key}`);
      let attr = this.get('content.attr');
      let mappedKey = this.get('typeMapping')[key] || key;
      if (originalValue !== false) {
        return originalValue || this.translationService.t(
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
