import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { resolve } from 'rsvp';

module('Integration | Component | inputs/collection-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders collection of strings as options', async function(assert) {
    this.set('collection', ['Cooking', 'Sports', 'Politics']);
    this.set('modelValue', 'Cooking');

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue}}
    `);

    assert.dom('select').exists();

    let options = this.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0]).hasAttribute('value', 'Cooking');
    assert.dom(options[1]).hasAttribute('value', 'Sports');
    assert.dom(options[2]).hasAttribute('value', 'Politics');
  });

  test('it renders collection objects as options', async function(assert) {
    this.set('collection', [{
        id: 1, name: 'Cooking', slug: 'cooking', headline: 'For kitchen geeks!'
      }, {
        id: 2, name: 'Sports', slug: 'sports', headline: 'For couch potatos'
      }, {
        id: 3, name: 'Politics', slug: 'politics', headline: 'For nerds'
      }]
    );
    this.set('modelValue', this.collection[1]);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue}}
    `);

    let options = this.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0]).hasAttribute('value', "1");
    assert.dom(options[1]).hasAttribute('value', "2");
    assert.dom(options[2]).hasAttribute('value', "3");

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue
        optionLabelPath="content.headline" optionValuePath="content.slug"}}
    `);

    options = this.element.querySelectorAll('option');

    assert.dom(options[0]).hasText('For kitchen geeks!');
    assert.dom(options[1]).hasText('For couch potatos');
    assert.dom(options[2]).hasText('For nerds');
    assert.dom(options[0]).hasAttribute('value', 'cooking');
    assert.dom(options[1]).hasAttribute('value', 'sports');
    assert.dom(options[2]).hasAttribute('value', 'politics');
  });

  test('it selects given values', async function(assert) {
    this.set('collection', [{
        id: 1, name: 'Cooking'
      }, {
        id: 2, name: 'Sports'
      }, {
        id: 3, name: 'Politics'
      }]
    );
    this.set('modelValue', this.collection[0]);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue}}
    `);

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value=Cooking]').matchesSelector(':checked');

    this.set('modelValue', [this.collection[1], this.collection[2]]);

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value=Sports]').matchesSelector(':checked');
    assert.dom('option[value=Politics]').matchesSelector(':checked');

    this.set('modelValue', A([2]));
    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue
        optionValuePath="content.id" optionStringValuePath="value"}}
    `);

    assert.dom('option:checked').exists({ count: 1 });
    assert.dom('option[value="2"]').matchesSelector(':checked');

    run(() => this.get('modelValue').pushObject(1));
    await settled();

    assert.dom('option:checked').exists({ count: 2 });
    assert.dom('option[value="1"]').matchesSelector(':checked');
    assert.dom('option[value="2"]').matchesSelector(':checked');
  });

  test('it updates value after changing', async function(assert) {
    this.set('collection', [{
        id: 1, name: 'Cooking'
      }, {
        id: 2, name: 'Sports'
      }, {
        id: 3, name: 'Politics'
      }]
    );
    this.set('modelValue', [this.collection[0], this.collection[1]]);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue
        optionValuePath="content"}}
    `);
    this.element.querySelector('option[value="1"]').selected = false;
    this.element.querySelector('option[value="2"]').selected = false;
    this.element.querySelector('option[value="3"]').selected = true;
    this.element.querySelector('select').dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(this.modelValue.length, 1);
    assert.equal(this.modelValue[0].id, 3);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue
        optionValuePath="content.id" optionStringValuePath="value"}}
    `);
    this.element.querySelector('option[value="3"]').selected = false;
    this.element.querySelector('option[value="2"]').selected = true;
    this.element.querySelector('select').dispatchEvent(new Event('change', { bubbles: true }));

    assert.equal(this.modelValue.length, 1);
    assert.equal(this.modelValue[0], 2);
  });

  test('it sets the value after being displayed', async function(assert) {
    this.set('collection',['Cooking', 'Sports', 'Politics']);
    this.set('modelValue', null);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue}}
    `);

    assert.equal(this.modelValue, 'Cooking');
  });

  test('it sets the value after being displayed for async collection', async function(assert) {
    this.set('collection', resolve(['Cooking', 'Sports', 'Politics']));
    this.set('modelValue', null);

    await render(hbs`
      {{inputs/collection-input collection=collection modelValue=modelValue}}
    `);

    assert.equal(this.modelValue, 'Cooking');
  });

  test('it detects multiple mode', async function(assert) {
    this.set('modelValue', null);

    await render(hbs`
      {{inputs/collection-input modelValue=modelValue}}
    `);

    assert.dom('select').doesNotHaveAttribute('multiple');

    this.set('modelValue', []);

    assert.dom('select').hasAttribute('multiple');
  });
});
