import { capitalize, underscore } from '@ember/string';

export default function(string) {
  return capitalize(underscore(string).split("_").join(" "));
}
