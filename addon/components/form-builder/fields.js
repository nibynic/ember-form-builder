import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import FormBuilder from 'ember-form-builder/components/form-builder';

@classic
@tagName('div')
export default class Fields extends FormBuilder {
  @computed('on.formBuilder')
  get parentFormBuilder() {
    return this._parentFormBuilder || this.get('on.formBuilder') || this.get('on');
  }
  set parentFormBuilder(v) {
    return this._parentFormBuilder = v;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.get('parentFormBuilder').addChild(this.get('formBuilder'));
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.get('parentFormBuilder').removeChild(this.get('formBuilder'));
  }
}
