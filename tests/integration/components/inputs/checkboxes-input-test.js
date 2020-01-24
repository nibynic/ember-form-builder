import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | inputs/checkboxes-input', async function(hooks) {
  setupRenderingTest(hooks);

  module('collection of strings', function(hooks) {
    hooks.beforeEach(async function() {
      this.config = {
        name: 'myInput',
        disabled: false,
        autocomplete: 'country',
        collection: ['France', 'Spain', 'Germany', 'United Kingdom']
      };
    });

    module('single select', function(hooks) {
      hooks.beforeEach(async function() {
        this.set('config.value', 'France');
        await render(hbs`{{inputs/checkboxes-input config=config}}`);
      });

      test('it renders', async function(assert) {
        assert.dom('input').hasAttribute('type', 'radio');
        assert.dom('input').hasAttribute('name', 'myInput');
        assert.dom('input[value=France]').exists();
        assert.dom(this.element).includesText('France');
        assert.dom('input[value=Spain]').exists();
        assert.dom(this.element).includesText('Spain');
        assert.dom('input[value=Germany]').exists();
        assert.dom(this.element).includesText('Germany');
        assert.dom('input[value="United Kingdom"]').exists();
        assert.dom(this.element).includesText('United Kingdom');
      });

      test('it updates value', async function(assert) {
        assert.dom('input[value=France]').isChecked();

        this.set('config.value', 'Germany');

        assert.dom('input[value=Germany]').isChecked();

        await click('input[value=Spain]');

        assert.equal(this.config.value, 'Spain');
      });

      test('it can be disabled', async function(assert) {
        assert.dom('input:disabled').doesNotExist();

        this.set('config.disabled', true);

        assert.dom('input:disabled').exists({ count: 4 });
      });

      test('it supports presence validations', async function(assert) {
        assert.dom('input[required]').doesNotExist();

        this.set('config.validations', { required: true });

        assert.dom('input[required]').exists({ count: 4 });
      });
    });

    module('multiple select', function(hooks) {
      hooks.beforeEach(async function() {
        this.set('config.value', ['France']);
        await render(hbs`{{inputs/checkboxes-input config=config}}`);
      });

      test('it renders', async function(assert) {
        assert.dom('input[type=checkbox]').exists({ count: 4 });
      });

      test('it updates value', async function(assert) {
        assert.dom('input:checked').exists({ count: 1 });
        assert.dom('input[value=France]').isChecked();

        this.config.value.addObject('Germany');
        await settled();

        assert.dom('input:checked').exists({ count: 2 });
        assert.dom('input[value=Germany]').isChecked();

        await click('input[value=Spain]');

        assert.deepEqual(this.config.value, ['France', 'Spain', 'Germany']);

        await click('input[value=Germany]');

        assert.deepEqual(this.config.value, ['France', 'Spain']);
      });

      test('it does not render required attribute', async function(assert) {
        this.set('config.validations', { required: true });

        assert.dom('input[required]').doesNotExist();
      });
    });
  });

  module('collection of objects', function(hooks) {
    hooks.beforeEach(async function() {
      this.collection = [{
        value: 1, label: 'Cooking', content: {}
      }, {
        value: 2, label: 'Sports', content: {}
      }, {
        value: 3, label: 'Politics', content: {}
      }];
    });

    module('single select', function(hooks) {
      hooks.beforeEach(async function() {
        this.set('config', {
          value:      this.collection[1].content,
          collection: this.collection
        });

        await render(hbs`
          {{inputs/checkboxes-input config=config}}
        `);
      });

      test('it renders', async function(assert) {
        assert.dom('input').hasAttribute('type', 'radio');
        assert.dom('input[value="1"]').exists();
        assert.dom(this.element).includesText('Cooking');
        assert.dom('input[value="2"]').exists();
        assert.dom(this.element).includesText('Sports');
        assert.dom('input[value="3"]').exists();
        assert.dom(this.element).includesText('Politics');
      });

      test('it selects given values', async function(assert) {
        assert.dom('input:checked').exists({ count: 1 });
        assert.dom('input[value="2"]').isChecked();

        this.set('config.value', this.collection[2].content);
        await settled();

        assert.dom('input:checked').exists({ count: 1 });
        assert.dom('input[value="3"]').isChecked();
      });
    });

    module('multiple select', function(hooks) {
      hooks.beforeEach(async function() {
        this.set('config', {
          value:      [this.collection[1].content, this.collection[2].content],
          collection: this.collection
        });

        await render(hbs`
          {{inputs/checkboxes-input config=config}}
        `);
      });

      test('it renders', async function(assert) {
        assert.dom('input[type=checkbox]').exists({ count: 3 });
      });

      test('it selects given values', async function(assert) {
        assert.dom('input:checked').exists({ count: 2 });
        assert.dom('input[value="2"]').isChecked();
        assert.dom('input[value="3"]').isChecked();

        this.get('config.value').pushObject(this.collection[0].content);
        await settled();

        assert.dom('input:checked').exists({ count: 3 });
        assert.dom('input[value="1"]').isChecked();
      });
    });
  });
});
