import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | DataAdapter | EmberOrbit', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.model = EmberObject.extend({
      type: 'fake-model'
    }).reopenClass({
      attributes: {},
      relationships: {}
    }).create();
    this.adapter = this.owner.factoryFor('data-adapter:ember-orbit').create({
      object: this.model
    });
  });

  test('it detects EmberOrbit model', function(assert) {
    var invalidModel = EmberObject.create();

    assert.ok(this.adapter.isModel(this.model));
    assert.notOk(this.adapter.isModel(invalidModel));
  });

  test('it detects model name', function(assert) {
    assert.equal(this.adapter.modelName, 'fake-model');
  });
});
