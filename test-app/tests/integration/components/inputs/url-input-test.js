import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/url-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      value: 'example.com',
      name: 'myInput',
      disabled: false,
      autocomplete: 'url',
      texts: {
        placeholder: 'Your website',
      },
    };

    await render(hbs`<Inputs::UrlInput @config={{this.config}} />`);
  });

  test('it renders', async function (assert) {
    assert.dom('input').hasAttribute('type', 'url');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'url');
    assert.dom('input').hasAttribute('placeholder', 'Your website');
  });

  test('it updates value', async function (assert) {
    assert.dom('input').hasValue('example.com');

    this.set('config', { value: 'my.example.com' });

    assert.dom('input').hasValue('my.example.com');

    await fillIn('input', 'another.example.com');

    assert.strictEqual(this.config.value, 'another.example.com');
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
