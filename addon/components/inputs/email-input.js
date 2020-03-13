import classic from 'ember-classic-decorator';
import { reads } from '@ember/object/computed';
import StringInput from './string-input';

@classic
export default class EmailInput extends StringInput {
  type = 'email';

  @reads('config.multiple')
  multiple;
}
