import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/text-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: '123 hello',
      name: 'myInput',
      disabled: false,
      autocomplete: 'name',
      texts: {
        placeholder: 'Your name',
      },
    };

    await render(hbs`<Inputs::TextInput @config={{config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('textarea').hasAttribute('name', 'myInput');
    assert.dom('textarea').hasAttribute('autocomplete', 'name');
    assert.dom('textarea').hasAttribute('placeholder', 'Your name');
  });

  test('it updates value', async function (assert) {
    assert.dom('textarea').hasValue('123 hello');

    this.set('config.value', 'hello?');

    assert.dom('textarea').hasValue('hello?');

    await fillIn('textarea', 'bye!');

    assert.equal(this.config.value, 'bye!');
  });

  test('it can be disabled', async function (assert) {
    assert.dom('textarea').isNotDisabled();

    this.set('config.disabled', true);

    assert.dom('textarea').isDisabled();
  });

  test('it supports presence validations', async function (assert) {
    assert.dom('textarea').doesNotHaveAttribute('required');

    this.set('config.validations', { required: true });

    assert.dom('textarea').hasAttribute('required');
  });
});
