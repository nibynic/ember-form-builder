/* eslint-disable ember/no-classic-classes */
import { dependencySatisfies } from '@embroider/macros';
import EmberObject from '@ember/object';

export default function (source, getter) {
  if (dependencySatisfies('ember-source', '>= 3.24.0')) {
    return new Proxy(source, {
      get(self, key) {
        if (key in self || typeof key === 'symbol') {
          return self[key];
        }
        return getter.call(self, source, key);
      },
      has() {
        return true;
      },
    });
  } else {
    return EmberObject.extend({
      unknownProperty(key) {
        return getter.call(this, source, key);
      },
    }).create();
  }
}
