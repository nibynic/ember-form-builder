import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { resolve } from 'rsvp';

module('Integration | Component | inputs/collection-input', function(hooks) {
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
        await render(hbs`<Inputs::CollectionInput @config={{config}} />`);
      });

      test('it renders', async function(assert) {
        assert.dom('select').doesNotHaveAttribute('multiple');
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

    module('multiple select', function(hooks) {
      hooks.beforeEach(async function() {
        this.set('config.value', ['France']);
        await render(hbs`<Inputs::CollectionInput @config={{config}} />`);
      });

      test('it renders', async function(assert) {
        assert.dom('select').hasAttribute('multiple');
      });

      test('it updates value', async function(assert) {
        assert.dom('option:checked').exists({ count: 1 });
        assert.dom('option[value=France]').matchesSelector(':checked');

        this.config.value.addObject('Germany');
        await settled();

        assert.dom('option:checked').exists({ count: 2 });
        assert.dom('option[value=Germany]').matchesSelector(':checked');

        await fillIn('select', 'Spain');

        assert.deepEqual(this.config.value, ['Spain']);
      });
    });
  });

  module('collection of objects', function(hooks) {
    hooks.beforeEach(async function() {
      this.collection = [{
        value: 1, label: 'Cooking', content: { id: '1' }
      }, {
        value: 2, label: 'Sports', content: { id: '2' }
      }, {
        value: 3, label: 'Politics', content: { id: '3' }
      }];
    });

    module('without key', function() {
      module('single select', function(hooks) {
        hooks.beforeEach(async function() {
          this.set('config', {
            value:      this.collection[1].content,
            collection: this.collection
          });

          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);
        });

        test('it renders', async function(assert) {
          let options = this.element.querySelectorAll('option');

          assert.dom('select').doesNotHaveAttribute('multiple');
          assert.dom(options[0]).hasText('Cooking');
          assert.dom(options[1]).hasText('Sports');
          assert.dom(options[2]).hasText('Politics');
          assert.dom(options[0]).hasAttribute('value', '1');
          assert.dom(options[1]).hasAttribute('value', '2');
          assert.dom(options[2]).hasAttribute('value', '3');
        });

        test('it selects given values', async function(assert) {
          assert.dom('option:checked').exists({ count: 1 });
          assert.dom('option[value="2"]').matchesSelector(':checked');

          this.set('config.value', this.collection[2].content);
          await settled();

          assert.dom('option:checked').exists({ count: 1 });
          assert.dom('option[value="3"]').matchesSelector(':checked');
        });

        test('it sets the value after being displayed', async function(assert) {
          this.set('config.value', undefined);
          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);

          assert.equal(this.config.value, this.collection[0].content);
        });
      });

      module('multiple select', function(hooks) {
        hooks.beforeEach(async function() {
          this.set('config', {
            value:      [this.collection[1].content, this.collection[2].content],
            collection: this.collection
          });

          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);
        });

        test('it renders', async function(assert) {
          assert.dom('select').hasAttribute('multiple');
        });

        test('it selects given values', async function(assert) {
          assert.dom('option:checked').exists({ count: 2 });
          assert.dom('option[value="2"]').matchesSelector(':checked');
          assert.dom('option[value="3"]').matchesSelector(':checked');

          this.config.value.pushObject(this.collection[0].content);
          await settled();

          assert.dom('option:checked').exists({ count: 3 });
          assert.dom('option[value="1"]').matchesSelector(':checked');
        });

        test('it does not set the value after being displayed', async function(assert) {
          this.set('config.value', []);
          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);

          assert.deepEqual(this.config.value, []);
        });
      });
    });

    module('with key', function() {
      module('single select', function(hooks) {
        hooks.beforeEach(async function() {
          this.set('config', {
            value:      { id: '2' },
            collection: this.collection,
            key:        'id'
          });

          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);
        });

        test('it selects given values', async function(assert) {
          assert.dom('option:checked').exists({ count: 1 });
          assert.dom('option[value="2"]').matchesSelector(':checked');

          this.set('config.value', { id: '3' });
          await settled();

          assert.dom('option:checked').exists({ count: 1 });
          assert.dom('option[value="3"]').matchesSelector(':checked');
        });

        test('it sets the value after being displayed', async function(assert) {
          this.set('config.value', undefined);
          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);

          assert.equal(this.config.value, this.collection[0].content);
        });
      });

      module('multiple select', function(hooks) {
        hooks.beforeEach(async function() {
          this.set('config', {
            value:      [{ id: '2' }, { id: '3' }],
            collection: this.collection,
            key:        'id'
          });

          await render(hbs`
            <Inputs::CollectionInput @config={{config}} />
          `);
        });

        test('it selects given values', async function(assert) {
          assert.dom('option:checked').exists({ count: 2 });
          assert.dom('option[value="2"]').matchesSelector(':checked');
          assert.dom('option[value="3"]').matchesSelector(':checked');

          this.config.value.pushObject({ id: '1' });
          await settled();

          assert.dom('option:checked').exists({ count: 3 });
          assert.dom('option[value="1"]').matchesSelector(':checked');
        });
      });
    });
  });

  module('async collections', function() {
    test('it sets the value after being displayed for async collection', async function(assert) {
      this.set('config', {
        collection: resolve(['Cooking', 'Sports', 'Politics'])
      });

      await render(hbs`
        <Inputs::CollectionInput @config={{config}} />
      `);

      assert.equal(this.config.value, 'Cooking');
    });
  });
});
