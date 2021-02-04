import { alias } from '@ember/object/computed';
import Component from '@glimmer/component';
import { get, set, computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { resolve } from 'rsvp';
import { action } from '@ember/object';
import { next } from '@ember/runloop';

export default class CollectionInput extends Component {
  @alias('args.config.collection')
  collection;

  @alias('args.config.value')
  value;

  @computed('args.config.collection')
  get collectionPromise() {
    return ObjectProxy.extend(PromiseProxyMixin).create({
      promise: resolve(this.args.config.collection)
    });
  }

  @computed('collectionPromise.content.[]')
  get resolvedCollection() {
    return (this.collectionPromise.content || []).map((option) => {
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

  @action
  setDefaultValue(element) {
    next(this, this.handleChange, { currentTarget: element });
  }

  @action
  handleChange(e) {
    if (this.args.getSelectedIndices) {
      this._setSelection(this.args.getSelectedIndices());
    } else {
      let selected = Array.prototype.slice.call(e.currentTarget.querySelectorAll('option:checked'));
      this._setSelection(selected.map((el) => el.index));
    }
  }

  _setSelection(indicies) {
    this.collectionPromise.then(() => {

      let newValues = A(A(this.resolvedCollection).objectsAt(indicies)).mapBy('content');
      let value = this.value;

      if (this.multiple) {
        A(value).replace(0, get(value, 'length'), newValues);
      } else {
        set(this, 'args.config.value', newValues[0]);
      }
    });
  }

  @computed('value')
  get multiple() {
    return isArray(this.value);
  }
}
