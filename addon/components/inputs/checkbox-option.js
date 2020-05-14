import SelectOption from 'ember-form-builder/components/inputs/select-option';
import { guidFor } from '@ember/object/internals';

export default class CheckboxOption extends SelectOption {
  inputElementId = guidFor(Math.random());
}
