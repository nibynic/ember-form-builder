/* eslint-disable ember/no-classic-classes */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | DataAdapter | EmberData', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.model = EmberObject.extend()
      .reopenClass({ modelName: 'fake-model' })
      .create();
    this.adapter = this.owner.factoryFor('data-adapter:ember-data').create({
      object: this.model,
    });
  });

  test('it detects EmberData model', function (assert) {
    var invalidModel = EmberObject.create();

    assert.ok(this.adapter.isModel(this.model));
    assert.notOk(this.adapter.isModel(invalidModel));
  });

  test('it detects model name', function (assert) {
    assert.strictEqual(this.adapter.modelName, 'fake-model');
  });
});
