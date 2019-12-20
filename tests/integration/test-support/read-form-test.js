import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { readForm } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | TestSupport | read-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it reads model data', async function(assert) {
    this.model = {
      firstName:  'Jan',
      age:        37
    };
    await render(hbs`
      {{#form-builder for=model name="person" as |f|}}
        {{f.input "firstName"}}
        {{f.input "age" as="number"}}
      {{/form-builder}}
    `);

    assert.deepEqual(readForm('person', ['firstName', 'age']), this.model);
    assert.deepEqual(readForm('person', this.model), this.model);
  });

  test('it reads nested object data', async function(assert) {
    this.model = {
      address: {
        street: 'Elm Str'
      }
    };
    await render(hbs`
      {{#form-builder for=model name="person" as |f|}}
        {{#f.fields for=model.address name="address" as |ff|}}
          {{ff.input "street"}}
        {{/f.fields}}
      {{/form-builder}}
    `);

    assert.deepEqual(readForm('person', ['address.street']), this.model);
    assert.deepEqual(readForm('person', this.model), this.model);

    assert.deepEqual(readForm('person.address', ['street']), this.model.address);
    assert.deepEqual(readForm('person.address', this.model.address), this.model.address);
  });

  test('it reads nested array data', async function(assert) {
    this.model = {
      children: [
        { firstName: 'Jan' },
        { firstName: 'Anna' }
      ]
    };
    await render(hbs`
      {{#form-builder for=model name="person" as |f|}}
        {{#each model.children as |child i|}}
          {{#f.fields for=child name="child" index=i as |ff|}}
            {{ff.input "firstName"}}
          {{/f.fields}}
        {{/each}}
      {{/form-builder}}
    `);

    assert.deepEqual(readForm('person', ['children.0.firstName', 'children.1.firstName']), this.model);
    assert.deepEqual(readForm('person', this.model), this.model);

    assert.deepEqual(readForm('person.children.1', ['firstName']), this.model.children[1]);
    assert.deepEqual(readForm('person.children.1', this.model.children[1]), this.model.children[1]);
  });
});
