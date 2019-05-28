import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/email-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 'jan.testowy@example.com');

    await render(hbs`{{inputs/email-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'email');
    assert.dom('input').hasValue('jan.testowy@example.com');

    await fillIn('input', 'janina.kaszanina@example.com');

    assert.equal(this.modelValue,  'janina.kaszanina@example.com');
  });
});
