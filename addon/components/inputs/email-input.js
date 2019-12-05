import StringInput from './string-input';
import { reads } from '@ember/object/computed';

export default StringInput.extend({
  type:     'email',
  multiple: reads('config.multiple')
});
