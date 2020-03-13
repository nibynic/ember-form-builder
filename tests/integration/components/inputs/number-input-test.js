import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/number-input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.config = {
      value: 123,
      name: 'myInput',
      disabled: false,
      autocomplete: 'cc-csc',
      texts: {
        placeholder: 'Verification number'
      }
    };

    await render(hbs`<Inputs::NumberInput @config={{config}} />`);
  });

  test('it renders', async function(assert) {
    assert.dom('input').hasAttribute('type', 'number');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'cc-csc');
    assert.dom('input').hasAttribute('placeholder', 'Verification number');
  });

  test('it updates value', async function(assert) {
    assert.dom('input').hasValue('123');

    this.set('config.value', 456);

    assert.dom('input').hasValue('456');

    await fillIn('input', '789');

    assert.equal(this.config.value, 789);

    await fillIn('input', '');

    assert.equal(this.config.value, undefined);
  });

  test('it can be disabled', async function(assert) {
    assert.dom('input').isNotDisabled();

    this.set('config.disabled', true);

    assert.dom('input').isDisabled();
  });

  test('it supports presence validations', async function(assert) {
    assert.dom('input').doesNotHaveAttribute('required');

    this.set('config.validations', { required: true });

    assert.dom('input').hasAttribute('required');
  });

  test('it supports numericality validations', async function(assert) {
    this.set('config.validations', {
      number: {gt: 5, lt: 120}
    });

    assert.dom('input').hasAttribute('min', '5.01');
    assert.dom('input').hasAttribute('max', '119.99');
    assert.dom('input').hasAttribute('step', '0.01');

    this.set('config.validations', {
      number: {gte: 5, lte: 120, integer: true}
    });

    assert.dom('input').hasAttribute('min', '5');
    assert.dom('input').hasAttribute('max', '120');
    assert.dom('input').hasAttribute('step', '1');
  });
});
