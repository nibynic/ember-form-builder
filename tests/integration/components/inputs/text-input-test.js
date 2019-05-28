import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/text-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 'abc');

    await render(hbs`{{inputs/text-input modelValue=modelValue}}`);

    assert.dom('textarea').hasValue('abc');

    await fillIn('textarea', 'xyz');

    assert.equal(this.get('modelValue'),  'xyz');
  });
});
