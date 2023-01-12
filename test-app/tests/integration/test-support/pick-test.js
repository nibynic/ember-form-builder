import { module, test } from 'qunit';
import { pick } from 'ember-form-builder/test-support';

module('Integration | TestSupport | pick', function () {
  test('it picks only selected attributes', function (assert) {
    this.model = {
      firstName: 'Jan',
      age: 37,
      lastName: 'unknown',
    };

    let partialData = {
      firstName: 'Jan',
      age: 37,
    };

    assert.deepEqual(pick(this.model, ['firstName', 'age']), partialData);
    assert.deepEqual(pick(this.model, partialData), partialData);
  });
});
