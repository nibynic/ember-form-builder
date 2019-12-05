import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/checkboxes-input', async function(hooks) {
  setupRenderingTest(hooks);

  test('it renders collection of strings as radio buttons or checkboxes', async function(assert) {
    this.set('config', {
      collection: ['Cooking', 'Sports', 'Politics'],
      value: 'Cooking'
    });

    await render(hbs`
      {{inputs/checkboxes-input config=config}}
    `);

    let options = this.element.querySelectorAll('label');

    assert.dom('input').hasAttribute('type', 'radio');
    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0].querySelector('input')).hasAttribute('value', 'Cooking');
    assert.dom(options[1].querySelector('input')).hasAttribute('value', 'Sports');
    assert.dom(options[2].querySelector('input')).hasAttribute('value', 'Politics');

    this.set('config.value', ['Cooking']);
    this.set('config.multiple', true);

    options = this.element.querySelectorAll('label');

    assert.dom('input').hasAttribute('type', 'checkbox');
    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0].querySelector('input')).hasAttribute('value', 'Cooking');
    assert.dom(options[1].querySelector('input')).hasAttribute('value', 'Sports');
    assert.dom(options[2].querySelector('input')).hasAttribute('value', 'Politics');
  });

  test('it renders collection objects as inputs', async function(assert) {
    this.set('config', {
      collection: [{
        id: 1, name: 'Cooking', slug: 'cooking', headline: 'For kitchen geeks!'
      }, {
        id: 2, name: 'Sports', slug: 'sports', headline: 'For couch potatos'
      }, {
        id: 3, name: 'Politics', slug: 'politics', headline: 'For nerds'
      }],
      value: {
        id: 2, name: 'Sports', slug: 'sports', headline: 'For couch potatos'
      }
    });

    await render(hbs`
      {{inputs/checkboxes-input config=config}}
    `);

    let options = this.element.querySelectorAll('label');

    assert.dom(options[0]).hasText('Cooking');
    assert.dom(options[1]).hasText('Sports');
    assert.dom(options[2]).hasText('Politics');
    assert.dom(options[0].querySelector('input')).hasAttribute('value', "1");
    assert.dom(options[1].querySelector('input')).hasAttribute('value', "2");
    assert.dom(options[2].querySelector('input')).hasAttribute('value', "3");

    this.set('config.optionLabelPath', 'content.headline');
    this.set('config.optionStringValuePath', 'value.slug');

    options = this.element.querySelectorAll('label');

    assert.dom(options[0]).hasText('For kitchen geeks!');
    assert.dom(options[1]).hasText('For couch potatos');
    assert.dom(options[2]).hasText('For nerds');
    assert.dom(options[0].querySelector('input')).hasAttribute('value', 'cooking');
    assert.dom(options[1].querySelector('input')).hasAttribute('value', 'sports');
    assert.dom(options[2].querySelector('input')).hasAttribute('value', 'politics');
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
      value: collection[1],
      collection
    })

    await render(hbs`
      {{inputs/checkboxes-input config=config}}
    `);

    assert.dom('input[type=radio]:checked').exists({ count: 1 });
    assert.dom('input[type=radio][value="2"]').isChecked();

    this.set('config.value', collection[2]);

    assert.dom('input[type=radio]:checked').exists({ count: 1 });
    assert.dom('input[type=radio][value="3"]').isChecked();

    this.set('config.value', A([collection[2]]));
    this.set('config.multiple', true);

    assert.dom('input[type=checkbox]:checked').exists({ count: 1 });
    assert.dom('input[type=checkbox][value="3"]').isChecked();

  });

  test('it updates value after changing', async function(assert) {
    this.set('config', {
      collection: [{
        id: 1, name: 'Cooking'
      }, {
        id: 2, name: 'Sports'
      }, {
        id: 3, name: 'Politics'
      }],
      value: {
        id: 1, name: 'Cooking'
      }
    });

    await render(hbs`
      {{inputs/checkboxes-input config=config}}
    `);

    await click('input[value="1"]');
    await click('input[value="3"]');

    assert.equal(this.config.value.id, 3);

    this.set('config.value', []);

    await click('input[value="1"]');
    await click('input[value="3"]');

    assert.deepEqual(this.config.value, [
      {
        id: 1, name: 'Cooking'
      }, {
        id: 3, name: 'Politics'
      }
    ]);

    await click('input[value="3"]');

    assert.deepEqual(this.config.value, [
      {
        id: 1, name: 'Cooking'
      }
    ]);
  });
});
