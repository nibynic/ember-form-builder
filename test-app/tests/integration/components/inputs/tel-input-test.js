import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/tel-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: '0700606060',
      name: 'myInput',
      disabled: false,
      autocomplete: 'tel',
      texts: {
        placeholder: 'Your phone number',
      },
    };

    await render(hbs`<Inputs::TelInput @config={{this.config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('input').hasAttribute('type', 'tel');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'tel');
    assert.dom('input').hasAttribute('placeholder', 'Your phone number');
  });

  test('it updates value', async function (assert) {
    assert.dom('input').hasValue('0700606060');

    this.set('config', { value: '0800801801' });

    assert.dom('input').hasValue('0800801801');

    await fillIn('input', '0800801802');

    assert.strictEqual(this.config.value, '0800801802');
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
