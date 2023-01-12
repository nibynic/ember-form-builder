import Component from '@glimmer/component';
import { A, isArray } from '@ember/array';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

class CollectionPromise {
  @tracked content;

  constructor(promise) {
    this.waitForContent(promise);
  }

  async waitForContent(promise) {
    this.content = await promise;
  }
}

export default class CollectionInput extends Component {
  get value() {
    return this.args.config.value;
  }

  #collectionPromise = createCache(() => {
    return new CollectionPromise(this.args.config.collection);
  });
  get collectionPromise() {
    return getValue(this.#collectionPromise);
  }

  get resolvedCollection() {
    return (this.collectionPromise.content || []).map((option) => {
      if (typeof option === 'object') {
        return option;
      } else {
        return {
          value: option,
          label: option,
          content: option,
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
      let selected = Array.prototype.slice.call(
        e.currentTarget.querySelectorAll('option:checked')
      );
      this._setSelection(selected.map((el) => el.index));
    }
  }

  async _setSelection(indicies) {
    await this.collectionPromise;
    let newValues = A(A(this.resolvedCollection).objectsAt(indicies)).mapBy(
      'content'
    );
    let value = this.value;

    if (this.multiple) {
      A(value).replace(0, this.value.length, newValues);
    } else if (!this.isDestroyed) {
      this.args.config.value = newValues[0];
    }
  }

  get multiple() {
    return isArray(this.value);
  }
}
