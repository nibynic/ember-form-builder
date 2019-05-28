import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/number-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 111);

    await render(hbs`{{inputs/number-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'number');
    assert.dom('input').hasValue('111');

    await fillIn('input', '222');

    assert.equal(this.modelValue, 222);

    await fillIn('input', '');

    assert.equal(this.modelValue, undefined);
  });

  test('it uses numericality validations', async function(assert) {
    this.set('modelValue', 111);
    this.set('validations', {
      number: {gt: 5, lt: 120}
    });

    await render(hbs`{{inputs/number-input modelValue=modelValue validations=validations}}`);

    assert.dom('input').hasAttribute('min', '5.01');
    assert.dom('input').hasAttribute('max', '119.99');
    assert.dom('input').hasAttribute('step', '0.01');

    this.set('validations', {
      number: {gte: 5, lte: 120, integer: true}
    });

    assert.dom('input').hasAttribute('min', '5');
    assert.dom('input').hasAttribute('max', '120');
    assert.dom('input').hasAttribute('step', '1');
  });
});
