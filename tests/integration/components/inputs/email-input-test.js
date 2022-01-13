import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/email-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: 'john@example.com',
      name: 'myInput',
      disabled: false,
      autocomplete: 'email',
      texts: {
        placeholder: 'Your email',
      },
    };

    await render(hbs`<Inputs::EmailInput @config={{config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('input').hasAttribute('type', 'email');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'email');
    assert.dom('input').hasAttribute('placeholder', 'Your email');
  });

  test('it updates value', async function (assert) {
    assert.dom('input').hasValue('john@example.com');

    this.set('config.value', 'margaret@example.com');

    assert.dom('input').hasValue('margaret@example.com');

    await fillIn('input', 'nick@example.com');

    assert.equal(this.config.value, 'nick@example.com');
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
