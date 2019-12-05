import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/date-input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.config = {
      value: new Date('2010-11-01'),
      name: 'myInput',
      disabled: false,
      autocomplete: 'bday',
      texts: {
        placeholder: 'Birth date'
      }
    };
    await render(hbs`{{inputs/date-input config=config}}`);
  });

  test('it renders', async function(assert) {
    assert.dom('input').hasAttribute('type', 'date');
    assert.dom('input').hasAttribute('name', 'myInput');
    assert.dom('input').hasAttribute('autocomplete', 'bday');
    assert.dom('input').hasAttribute('placeholder', 'Birth date');
  });

  test('it updates value', async function(assert) {
    assert.dom('input').hasValue('2010-11-01');

    this.set('config.value', new Date('2010-11-12'));

    assert.dom('input').hasValue('2010-11-12');

    await fillIn('input', '2015-12-12');

    assert.deepEqual(this.config.value, new Date('2015-12-12'));

    await fillIn('input', '');

    assert.equal(this.config.value, undefined);
  });

  test('it supports presence validations', async function(assert) {
    assert.dom('input').doesNotHaveAttribute('required');

    this.set('config.validations', { required: true });

    assert.dom('input').hasAttribute('required');
  });
});
