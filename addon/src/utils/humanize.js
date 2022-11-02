import { capitalize, underscore } from 'ember-cli-string-utils';

export default function (string) {
  return capitalize(underscore(string).split('_').join(' '));
}
