import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/date-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it aliases modelValue as value', async function(assert) {
    this.set('modelValue', new Date('2010-11-01T00:00'));

    await render(hbs`{{inputs/date-input modelValue=modelValue}}`);

    assert.dom('input').hasAttribute('type', 'date');
    assert.dom('input').hasValue('2010-11-01');

    this.set('modelValue', new Date('2015-12-12T00:00'));

    assert.dom('input').hasValue('2015-12-12');
  });

  test('it parses dates', async function(assert) {
    await render(hbs`{{inputs/date-input modelValue=modelValue}}`);
    await fillIn('input', '2015-12-12');

    assert.equal(this.modelValue.getTime(), new Date('2015-12-12T00:00').getTime());

    await fillIn('input', '');

    assert.equal(this.modelValue, undefined);
  });
});
