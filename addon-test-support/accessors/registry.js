import { assert } from '@ember/debug';
import string from './string';
import number from './number';

const Map = {
  string,
  number
};

export default {
  read(element) {
    let type = element.dataset.testInputType;
    assert(`Accessor not found for input ${element.dataset.testInputName} with type ${type}`, Map[type]);
    return Map[type].read(element);
  },

  register(type, { read, write }) {
    assert(`Both read and write methods are required for type ${type}`, read && write);
    Map[type] = { read, write };
  }
};
