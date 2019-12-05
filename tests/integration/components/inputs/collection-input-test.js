import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { resolve } from 'rsvp';

module('Integration | Component | inputs/collection-input', function(hooks) {
  setupRenderingTest(hooks);

  module('basic functionality', function(hooks) {
    hooks.beforeEach(async function() {
      this.config = {
        value: 'France',
        name: 'myInput',
        disabled: false,
        autocomplete: 'country',
        collection: ['France', 'Spain', 'Germany', 'United Kingdom']
      };

      await render(hbs`{{inputs/collection-input config=config}}`);
    });

    test('it renders', async function(assert) {
      assert.dom('select').hasAttribute('name', 'myInput');
      assert.dom('select').hasAttribute('autocomplete', 'country');
      assert.dom('option[value=France]').hasText('France');
      assert.dom('option[value=Spain]').hasText('Spain');
      assert.dom('option[value=Germany]').hasText('Germany');
      assert.dom('option[value="United Kingdom"]').hasText('United Kingdom');
    });

    test('it updates value', async function(assert) {
      assert.dom('select').hasValue('France');

      this.set('config.value', 'Germany');

      assert.dom('select').hasValue('Germany');

      await fillIn('select', 'Spain');

      assert.equal(this.config.value, 'Spain');
    });

    test('it can be disabled', async function(assert) {
      assert.dom('select').isNotDisabled();

      this.set('config.disabled', true);

      assert.dom('select').isDisabled();
    });

    test('it supports presence validations', async function(assert) {
      assert.dom('select').doesNotHaveAttribute('required');

      this.set('config.validations', { required: true });

      assert.dom('select').hasAttribute('required');
    });
  });

  test('it renders collection objects as options', async function(assert) {
    let collection = [{
      id: 1, name: 'Cooking', slug: 'cooking', headline: 'For kitchen geeks!'
    }, {
      id: 2, name: 'Sports', slug: 'sports', headline: 'For couch potatos'
    }, {
      id: 3, name: 'Politics', slug: 'politics', headline: 'For nerds'
    }];
    this.set('config', {
      value: collection[1],
      collection
    });

    await render(hbs`
      {{inputs/collection-input config=config}}
    `);

    let options = this.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0]).hasAttribute('value', "1");
    assert.dom(options[1]).hasAttribute('value', "2");
    assert.dom(options[2]).hasAttribute('value', "3");

    this.set('config',  {
      value: collection[1],
      optionLabelPath: 'content.headline',
      optionValuePath: 'content.slug',
      collection
    });

    options = this.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('For kitchen geeks!');
    assert.dom(options[1]).hasText('For couch potatos');
    assert.dom(options[2]).hasText('For nerds');
    assert.dom(options[0]).hasAttribute('value', 'cooking');
    assert.dom(options[1]).hasAttribute('value', 'sports');
    assert.dom(options[2]).hasAttribute('value', 'politics');
  });

  test('it selects given values', async function(assert) {
    let collection = [{
      id: 1, name: 'Cooking'
    }, {
      id: 2, name: 'Sports'
    }, {
      id: 3, name: 'Politics'
    }];
    this.set('config', {
      value: collection[0],
      collection
    });

    await render(hbs`
      {{inputs/collection-input config=config}}
    `);

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value=Cooking]').matchesSelector(':checked');

    this.set('config.value', [collection[1], collection[2]]);

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value=Sports]').matchesSelector(':checked');
    assert.dom('option[value=Politics]').matchesSelector(':checked');

    this.set('config', {
      value: A([2]),
      optionValuePath: 'content.id',
      optionStringValuePath: 'value',
      collection
    });

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value="2"]').matchesSelector(':checked');

    run(() => this.get('config.value').pushObject(1));
    await settled();

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value="1"]').matchesSelector(':checked');
    assert.dom('option[value="2"]').matchesSelector(':checked');
  });

  test('it updates value after changing', async function(assert) {
    let collection = [{
      id: 1, name: 'Cooking'
    }, {
      id: 2, name: 'Sports'
    }, {
      id: 3, name: 'Politics'
    }];
    this.set('config', {
      value: [collection[0], collection[1]],
      optionValuePath: 'content',
      collection
    });

    await render(hbs`
      {{inputs/collection-input config=config}}
    `);
    this.element.querySelector('option[value="1"]').selected = false;
    this.element.querySelector('option[value="2"]').selected = false;
    this.element.querySelector('option[value="3"]').selected = true;
    this.element.querySelector('select').dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(this.config.value.length, 1);
    assert.equal(this.config.value[0].id, 3);

    this.set('config.optionValuePath', 'content.id');
    this.set('config.optionStringValuePath', 'value');

    this.element.querySelector('option[value="3"]').selected = false;
    this.element.querySelector('option[value="2"]').selected = true;
    this.element.querySelector('select').dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(this.config.value.length, 1);
    assert.equal(this.config.value[0], 2);
  });

  test('it sets the value after being displayed', async function(assert) {
    this.set('config', {
      collection: ['Cooking', 'Sports', 'Politics']
    });

    await render(hbs`
      {{inputs/collection-input config=config}}
    `);

    assert.equal(this.config.value, 'Cooking');
  });

  test('it sets the value after being displayed for async collection', async function(assert) {
    this.set('config', {
      collection: resolve(['Cooking', 'Sports', 'Politics'])
    });

    await render(hbs`
      {{inputs/collection-input config=config}}
    `);

    assert.equal(this.config.value, 'Cooking');
  });

  test('it detects multiple mode', async function(assert) {
    this.set('config', {});
    await render(hbs`
      {{inputs/collection-input config=config}}
    `);

    assert.dom('select').doesNotHaveAttribute('multiple');

    this.set('config.value', []);

    assert.dom('select').hasAttribute('multiple');
  });
});
