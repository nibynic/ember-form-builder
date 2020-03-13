import classic from 'ember-classic-decorator';
import { attributeBindings, tagName, layout as templateLayout } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/form-builder/submit';
import byDefault from 'ember-form-builder/utilities/by-default';

@classic
@templateLayout(layout)
@tagName("button")
@attributeBindings("type", "disabled")
class SimpleSubmit extends Component {
  @service("formBuilderTranslations")
  translationService;

  type = "submit";

  @oneWay("builder.isLoading")
  disabled;

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

  @byDefault('builder.translationKey', 'translationService.locale', function() {
    return this.get('translationService').t(this.get('builder.translationKey'), 'action', 'submit') || 'Save';
  })
  text;
}

SimpleSubmit.reopenClass({
  positionalParams: ["builder"]
});

export default SimpleSubmit;
