import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { fillForm } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | TestSupport | fillForm', function (hooks) {
  setupRenderingTest(hooks);

  test('it writes model data', async function (assert) {
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

    let newData = {
      firstName: 'Wilhelm',
      age: 17,
    };
    await fillForm('person', newData);

    assert.deepEqual(this.model, newData);
  });

  test('it writes nested object data', async function (assert) {
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

    let newData = {
      address: {
        street: 'Sesame Str',
      },
    };

    await fillForm('person', newData);

    assert.deepEqual(this.model, newData);
  });

  test('it writes nested array data', async function (assert) {
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

    let newData = {
      children: [undefined, { firstName: 'Kris' }],
    };

    await fillForm('person', newData);

    assert.deepEqual(this.model, {
      children: [{ firstName: 'Jan' }, { firstName: 'Kris' }],
    });
  });
});
