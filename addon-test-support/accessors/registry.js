import { assert } from '@ember/debug';
import boolean from './boolean';
import checkboxes from './checkboxes';
import collection from './collection';
import date from './date';
import number from './number';
import string from './string';
import text from './text';

const Map = {
  boolean,
  checkboxes,
  collection,
  date,
  email: string,
  number,
  password: string,
  string,
  tel: string,
  text,
  url: string
};

export default {
  read(element) {
    let type = element.dataset.testInputType;
    assert(`Accessor not found for input ${element.dataset.testInputName} with type ${type}`, Map[type]);
    return Map[type].read(element);
  },

  write(element, value) {
    let type = element.dataset.testInputType;
    assert(`Accessor not found for input ${element.dataset.testInputName} with type ${type}`, Map[type]);
    return Map[type].write(element, value);
  },

  register(type, { read, write }) {
    assert(`Both read and write methods are required for type ${type}`, read && write);
    Map[type] = { read, write };
  }
};
