import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | DataAdapter | Base', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.model = {};
    this.adapter = this.owner.factoryFor('data-adapter:base').create({
      object: this.model
    });
    sinon.stub(this.adapter, 'isModel').callsFake((m) => m === this.model);
  });

  test('it finds model', function(assert) {
    this.adapter.set('object', this.model);

    assert.equal(this.adapter.model, this.model);

    this.adapter.set('object', {
      model: this.model
    });
    assert.equal(this.adapter.model, this.model);
  });

});
