import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/password-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: '123hello',
      name: 'myInput',
      disabled: false,
      autocomplete: 'current-password',
      texts: {
        placeholder: 'Your password',
      },
    };

    await render(hbs`<Inputs::PasswordInput @config={{config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('input').hasAttribute('type', 'password');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'current-password');
    assert.dom('input').hasAttribute('placeholder', 'Your password');
  });

  test('it updates value', async function (assert) {
    assert.dom('input').hasValue('123hello');

    this.set('config.value', 'hello?');

    assert.dom('input').hasValue('hello?');

    await fillIn('input', 'bye!');

    assert.equal(this.config.value, 'bye!');
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
