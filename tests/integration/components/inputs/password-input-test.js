import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/password-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 'passw0rd');

    await render(hbs`{{inputs/password-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'password');
    assert.dom('input').hasValue('passw0rd');

    await fillIn('input', 's3cr3t');

    assert.equal(this.modelValue, 's3cr3t');
  });
});
