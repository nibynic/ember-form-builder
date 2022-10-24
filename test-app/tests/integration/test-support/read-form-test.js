import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { readForm } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | TestSupport | readForm', function (hooks) {
  setupRenderingTest(hooks);

  test('it reads model data', async function (assert) {
    this.model = {
      firstName: 'Jan',
      age: 37,
    };
    await render(hbs`
      <FormBuilder @for={{this.model}} @name="person" as |f|>
        <f.input @attr="firstName" />
        <f.input @attr="age" @as="number" />
      </FormBuilder>
    `);

    assert.deepEqual(readForm('person', ['firstName', 'age']), this.model);
    assert.deepEqual(readForm('person', this.model), this.model);
  });

  test('it reads nested object data', async function (assert) {
    this.model = {
      address: {
        street: 'Elm Str',
      },
    };
    await render(hbs`
      <FormBuilder @for={{this.model}} @name="person" as |f|>
        <f.fields @for={{this.model.address}} @name="address" as |ff|>
          <ff.input @attr="street" />
        </f.fields>
      </FormBuilder>
    `);

    assert.deepEqual(readForm('person', ['address.street']), this.model);
    assert.deepEqual(readForm('person', this.model), this.model);

    assert.deepEqual(
      readForm('person.address', ['street']),
      this.model.address
    );
    assert.deepEqual(
      readForm('person.address', this.model.address),
      this.model.address
    );
  });

  test('it reads nested array data', async function (assert) {
    this.model = {
      children: [{ firstName: 'Jan' }, { firstName: 'Anna' }],
    };
    await render(hbs`
      <FormBuilder @for={{this.model}} @name="person" as |f|>
        {{#each this.model.children as |child i|}}
          <f.fields @for={{child}} @name="child" @index={{i}} as |ff|>
            <ff.input @attr="firstName" />
          </f.fields>
        {{/each}}
      </FormBuilder>
    `);

    assert.deepEqual(
      readForm('person', ['children.0.firstName', 'children.1.firstName']),
      this.model
    );
    assert.deepEqual(readForm('person', this.model), this.model);

    assert.deepEqual(
      readForm('person.children.1', ['firstName']),
      this.model.children[1]
    );
    assert.deepEqual(
      readForm('person.children.1', this.model.children[1]),
      this.model.children[1]
    );
  });
});
