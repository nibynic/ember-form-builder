import classic from 'ember-classic-decorator';
import StringInput from './string-input';

@classic
export default class TelInput extends StringInput {
  type = 'tel';
}
