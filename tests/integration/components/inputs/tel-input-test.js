import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/tel-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', '0700606060');

    await render(hbs`{{inputs/tel-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'tel');
    assert.dom('input').hasValue('0700606060');

    await fillIn('input', '0800801801');

    assert.equal(this.get('modelValue'),  '0800801801');
  });
});
