import classic from 'ember-classic-decorator';
import { attributeBindings, tagName, layout as templateLayout } from '@ember-decorators/component';
import { alias, reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/inputs/collection-input';
import { get, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { next, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';

@classic
@templateLayout(layout)
@tagName('select')
@attributeBindings(
  'autocomplete',
  'autofocus',
  'dir',
  'disabled',
  'inputmode',
  'multiple',
  'name',
  'pattern',
  'placeholder',
  'readonly',
  'required',
  'size',
  'tabindex'
)
export default class CollectionInput extends Component.extend(...['autocomplete', 'autofocus', 'collection', 'dir', 'disabled',
  'inputmode', 'inputElementId', 'name', 'pattern', 'readonly', 'size', 'tabindex'].map(
  (attr) => ({ [attr]: reads(`config.${attr}`) })
)) {
  optionComponentName = 'inputs/select-option';

  @alias('config.value')
  value;

  @computed('collection')
  get collectionPromise() {
    return ObjectProxy.extend(PromiseProxyMixin).create({
      promise: resolve(this.get('collection'))
    });
  }

  @computed('collectionPromise.content.[]')
  get resolvedCollection() {
    return (this.get('collectionPromise.content') || []).map((option) => {
      if (typeof option === 'object') {
        return option;
      } else {
        return {
          value:    option,
          label:    option,
          content:  option
        };
      }
    });
  }

  init() {
    super.init(...arguments);
    this.elementId = this.get('inputElementId');
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    // set default value in model
    this.nextRun = next(this, this.change);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    cancel(this.nextRun);
  }

  change() {
    let selected = Array.prototype.slice.call(this.element.querySelectorAll('option:checked'));
    this._setSelection(selected.map((el) => el.index));
  }

  _setSelection(indicies) {
    this.get('collectionPromise').then(() => {

      let newValues = A(A(this.get('resolvedCollection')).objectsAt(indicies)).mapBy('content');
      let value = this.get('value');

      if (isArray(value)) {
        A(value).replace(0, get(value, 'length'), newValues);
      } else {
        this.set('value', newValues[0]);
      }
    });
  }

  @computed('value')
  get multiple() {
    return isArray(this.get('value'));
  }

  @reads('config.validations.required')
  required;
}
