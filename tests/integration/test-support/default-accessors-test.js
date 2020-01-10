import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { readForm, fillForm } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | TestSupport | default accessors', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.model = {
      myAttr:  ''
    };
    this.as = 'string';
    await render(hbs`
      {{#form-builder for=model name="myModel" as |f|}}
        {{f.input "myAttr" as=as collection=collection}}
      {{/form-builder}}
    `);
  });

  module('boolean', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', true);
      this.set('as', 'boolean');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: false };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('checkboxes', function(hooks) {
    hooks.beforeEach(function() {
      this.set('collection', ['a', 'b', 'c']);
      this.set('as', 'checkboxes');
    });

    module('single', function(hooks) {
      hooks.beforeEach(function() {
        this.set('model.myAttr', 'a');
      });

      test('it reads', async function(assert) {
        assert.deepEqual(readForm('myModel', this.model), this.model);
      });

      test('it writes', async function(assert) {
        let newData = { myAttr: 'b' };
        await fillForm('myModel', newData);
        assert.deepEqual(this.model, newData);
      });
    });

    module('multiple', function(hooks) {
      hooks.beforeEach(function() {
        this.set('model.myAttr', ['a', 'b']);
      });

      test('it reads', async function(assert) {
        assert.deepEqual(readForm('myModel', this.model), this.model);
      });

      test('it writes', async function(assert) {
        let newData = { myAttr: ['b', 'c'] };
        await fillForm('myModel', newData);
        assert.deepEqual(this.model, newData);
      });
    });
  });

  module('collection', function(hooks) {
    hooks.beforeEach(function() {
      this.set('collection', ['a', 'b', 'c']);
      this.set('as', 'collection');
    });

    module('single', function(hooks) {
      hooks.beforeEach(function() {
        this.set('model.myAttr', 'a');
      });

      test('it reads', async function(assert) {
        assert.deepEqual(readForm('myModel', this.model), this.model);
      });

      test('it writes', async function(assert) {
        let newData = { myAttr: 'b' };
        await fillForm('myModel', newData);
        assert.deepEqual(this.model, newData);
      });
    });

    module('multiple', function(hooks) {
      hooks.beforeEach(function() {
        this.set('model.myAttr', ['a', 'b']);
      });

      test('it reads', async function(assert) {
        assert.deepEqual(readForm('myModel', this.model), this.model);
      });

      test('it writes', async function(assert) {
        let newData = { myAttr: ['b', 'c'] };
        await fillForm('myModel', newData);
        assert.deepEqual(this.model, newData);
      });
    });
  });

  module('date', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', new Date('2020-01-20'));
      this.set('as', 'date');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: new Date('2020-01-22')};
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('email', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 'hello@example.com');
      this.set('as', 'email');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 'bye@example.com'};
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('number', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 123);
      this.set('as', 'number');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 456 };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('password', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 'secret-1');
      this.set('as', 'password');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 'secret-2'};
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('string', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 'Hey!');
      this.set('as', 'string');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 'Bye!' };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('string', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', '111222333');
      this.set('as', 'tel');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: '444555666' };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('text', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 'Hello!');
      this.set('as', 'text');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 'Bye!' };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });

  module('url', function(hooks) {
    hooks.beforeEach(function() {
      this.set('model.myAttr', 'https://google.com');
      this.set('as', 'url');
    });

    test('it reads', async function(assert) {
      assert.deepEqual(readForm('myModel', this.model), this.model);
    });

    test('it writes', async function(assert) {
      let newData = { myAttr: 'https://duckduckgo.com' };
      await fillForm('myModel', newData);
      assert.deepEqual(this.model, newData);
    });
  });
});
