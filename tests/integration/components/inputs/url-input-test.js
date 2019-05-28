import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/url-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', 'http://foo.bar');

    await render(hbs`{{inputs/url-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'url');
    assert.dom('input').hasValue('http://foo.bar');

    await fillIn('input', 'http://bar.foo');

    assert.equal(this.modelValue, 'http://bar.foo');
  });
});
