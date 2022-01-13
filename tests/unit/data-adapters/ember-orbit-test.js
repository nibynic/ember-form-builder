import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | DataAdapter | EmberOrbit', function (hooks) {
  setupTest(hooks);

  class FakeModel {
    static attributes = {};
    static relationships = {};
    type = 'fake-model';
  }

  hooks.beforeEach(function () {
    this.model = new FakeModel();
    this.adapter = this.owner.factoryFor('data-adapter:ember-orbit').create({
      object: this.model,
    });
  });

  test('it detects EmberOrbit model', function (assert) {
    var invalidModel = {};

    assert.ok(this.adapter.isModel(this.model));
    assert.notOk(this.adapter.isModel(invalidModel));
  });

  test('it detects model name', function (assert) {
    assert.equal(this.adapter.modelName, 'fake-model');
  });
});
