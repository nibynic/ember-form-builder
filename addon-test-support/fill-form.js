import flatten from './lib/flatten';
import Accessors from './accessors/registry';
import findInput from './lib/find-input';
import { A } from '@ember/array';
import { settled } from '@ember/test-helpers';
import { blur } from '@ember/test-helpers';

export default async function (scope, attrs) {
  for (let [key, value] of Object.entries(flatten(attrs))) {
    await Accessors.write(
      findInput(A([scope, key]).compact().join('.')),
      value
    );
  }
  for (let input of document.querySelectorAll('input, select, textarea')) {
    try {
      await blur(input);
    } catch (e) {
      // continue regardless of error
    }
  }
  await settled();
}
