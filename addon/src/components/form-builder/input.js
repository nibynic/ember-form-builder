import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { defineProperty, action } from '@ember/object';
import humanize from '../../utils/humanize';
import guessType from '../../utils/guess-type';
import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';
import { dependentKeyCompat } from '@ember/object/compat';
import { once } from '@ember/runloop';

export default class InputComponent extends Component {
  @service('formBuilderTranslations') translationService;

  get value() {
    return this.args.builder.object[this.args.attr];
  }
  set value(v) {
    this.args.builder.object[this.args.attr] = v;
  }

  get validations() {
    return (this.args.builder.validationAdapter.attributes || {})[
      this.args.attr
    ];
  }

  config = new ConfigProxy(this);
  texts = new TextProxy(this);

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
    once(this, this.markAsFocuedOut);
  }

  @action
  markAsFocuedOut() {
    this.hasFocusedOut = true;
  }

  get canValidate() {
    return this.hasFocusedOut || !this.args.builder.isValid;
  }
}

class ConfigProxy {
  get value() {
    return this.content.value;
  }
  set value(v) {
    this.content.value = v;
  }

  get inputElementId() {
    return this.content.inputElementId;
  }
  get name() {
    return this.content.name;
  }
  get type() {
    return this.content.type;
  }
  get texts() {
    return this.content.texts;
  }
  get validations() {
    return this.content.validations;
  }
  get canValidate() {
    return this.content.canValidate;
  }
  @dependentKeyCompat
  get disabled() {
    return this.content.disabled;
  }

  constructor(content) {
    this.content = content;

    A(Object.keys(content.args))
      .removeObjects([
        'attr',
        'as',
        'builder',
        'canValidate',
        'disabled',
        'hint',
        'inputElementId',
        'label',
        'name',
        'placeholder',
        'type',
        'texts',
        'validations',
      ])
      .forEach((key) =>
        defineProperty(this, key, {
          get() {
            return this.content.args[key];
          },
        })
      );
  }
}

class TextProxy {
  constructor(context) {
    this.content = context.args;
    this.translationService = context.translationService;
    return new Proxy(this, {
      get(self, key) {
        if (key in self) {
          return self[key];
        }
        if (self.exists(key)) {
          return self.content[key] || self.translate(key.toString());
        }
        return undefined;
      },
    });
  }

  get label() {
    if (this.exists('label')) {
      return (
        this.content.label ||
        this.translate('attribute') ||
        humanize(this.content.attr)
      );
    }
    return undefined;
  }

  exists(type) {
    return this.content[type] !== false;
  }

  translate(type) {
    return this.translationService.t(
      this.content.builder.translationKey,
      type,
      this.content.attr
    );
  }
}
