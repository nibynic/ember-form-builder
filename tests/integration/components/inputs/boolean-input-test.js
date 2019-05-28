import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/boolean-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as checked', async function(assert) {
    this.set('modelValue', true);

    await render(hbs`{{inputs/boolean-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'checkbox');
    assert.dom('input').isChecked();

    this.set('modelValue', false);

    assert.dom('input').isNotChecked();
  });
});
