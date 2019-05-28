import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/string-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 'abc');

    await render(hbs`{{inputs/string-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'text');
    assert.dom('input').hasValue('abc');

    await fillIn('input', 'xyz');

    assert.equal(this.get('modelValue'),  'xyz');
  });
});
