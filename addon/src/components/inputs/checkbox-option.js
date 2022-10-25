import SelectOption from './select-option';
import { guidFor } from '@ember/object/internals';

export default class CheckboxOption extends SelectOption {
  inputElementId = guidFor(Math.random());
}
