import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import EmberObject, {
  defineProperty,
  computed,
  action
} from '@ember/object';
import humanize from 'ember-form-builder/utilities/humanize';
import guessType from 'ember-form-builder/utilities/guess-type';
import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';
import classic from 'ember-classic-decorator';
import { dependentKeyCompat } from '@ember/object/compat';

export default class Input extends Component {

  @service('formBuilderTranslations')
  translationService;

  
  constructor() {
    super(...arguments);
    defineProperty(this, 'value', alias(`args.builder.object.${this.args.attr}`));
    defineProperty(this, 'validations', alias(`args.builder.validationAdapter.attributes.${this.args.attr}`));
  }

  config  = new ConfigProxy(this);
  texts   = TextProxy.create({ context: this });


  get type() {
    return this.args.as || guessType(this.args.builder.model, this.args);
  }

  get wrapper() {
    return this.args.wrapper || 'default';
  }

  get inputElementId() {
    return this.args.inputElementId || `${guidFor(this)}Input`;
  }

  get name() {
    var prefix = this.args.builder.name;
    var name = this.args.attr;
    if (isPresent(prefix)) {
      name = prefix + '[' + name + ']';
    }
    return name;
  }

  get disabled() {
    return !!this.args.builder.isLoading || !!this.args.disabled;
  }

  @tracked
  hasFocusedOut = false;

  @action
  handleFocusOut() {
    this.hasFocusedOut = true;
  }

  get canValidate() {
    return this.hasFocusedOut || !this.args.builder.isValid;
  }
}

class ConfigProxy {
  @alias('content.value') value;

  get inputElementId()  { return this.content.inputElementId; }
  get name()            { return this.content.name; }
  get type()            { return this.content.type; }
  get texts()           { return this.content.texts; }
  get validations()     { return this.content.validations; }
  get canValidate()     { return this.content.canValidate; }
  @dependentKeyCompat
  get disabled()        { return this.content.disabled; }

  constructor(content) {
    this.content = content;

    A(Object.keys(content.args))
      .removeObjects(['attr', 'as', 'builder', 'canValidate', 'disabled',
        'hint', 'inputElementId', 'label', 'name', 'placeholder', 'type',
        'texts', 'validations'])
      .forEach(
        (key) => defineProperty(this, key, alias(`content.args.${key}`))
      );
  }
}

@classic
class TextProxy extends EmberObject {

  init() {
    super.init(...arguments);
    this.content = this.context.args;
    this.translationService = this.context.translationService;
  }

  @computed('content.{label,attr,builder.translationKey}', 'translationService.locale')
  get label() {
    if (this.exists('label')) {
      return this.content.label ||
        this.translate('attribute') ||
        humanize(this.content.attr);
    }
    return undefined;
  }

  exists(type) {
    return this.content[type] !== false;
  }

  translate(type) {
    return  this.translationService.t(
      this.content.builder.translationKey, type, this.content.attr
    );
  }

  unknownProperty(key) {
    defineProperty(this, key, computed(`content.{${key},attr,builder.translationKey}`, 'translationService.locale', {
      get() {
        if (this.exists(key)) {
          return this.content[key] || this.translate(key);
        }
        return undefined;
      }
    }));
    return this[key];
  }
}
