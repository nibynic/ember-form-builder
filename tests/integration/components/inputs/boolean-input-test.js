import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/boolean-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: true,
      name: 'myCheckbox',
      disabled: false,
      autocomplete: 'country',
    };

    await render(hbs`<Inputs::BooleanInput @config={{config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('input').hasAttribute('type', 'checkbox');
    assert.dom('input').hasAttribute('name', 'myCheckbox');
    assert.dom('input').hasAttribute('autocomplete', 'country');
  });

  test('it updates value', async function (assert) {
    assert.dom('input').isChecked();

    this.set('config.value', false);

    assert.dom('input').isNotChecked();

    await click('input');

    assert.equal(this.config.value, true);
  });

  test('it can be disabled', async function (assert) {
    assert.dom('input').isNotDisabled();

    this.set('config.disabled', true);

    assert.dom('input').isDisabled();
  });

  test('it supports presence validations', async function (assert) {
    assert.dom('input').doesNotHaveAttribute('required');

    this.set('config.validations', { required: true });

    assert.dom('input').hasAttribute('required');
  });
});
