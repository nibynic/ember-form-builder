import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, blur } from '@ember/test-helpers';
import { readErrors } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | TestSupport | readErrors', function (hooks) {
  setupRenderingTest(hooks);

  test('it reads validation errors', async function (assert) {
    this.model = {
      firstName: 'Jan',
      age: 37,
      validationsDummy: {
        firstName: {
          errors: ['cannot be blank'],
        },
      },
    };
    await render(hbs`
      <FormBuilder @for={{model}} @name="person" as |f|>
        <f.input @attr="firstName" />
        <f.input @attr="age" @as="number" />
      </FormBuilder>
    `);
    await fillIn('input[name*=firstName]', '');
    await blur('input[name*=firstName]');

    let errors = {
      firstName: 'cannot be blank',
    };

    assert.deepEqual(readErrors('person', ['firstName']), errors);
    assert.deepEqual(readErrors('person', errors), errors);
  });

  test('it reads nested object validation errors', async function (assert) {
    this.model = {
      address: {
        street: 'Elm Str',
        validationsDummy: {
          street: {
            errors: ['cannot be blank'],
          },
        },
      },
    };
    await render(hbs`
      <FormBuilder @for={{model}} @name="person" as |f|>
        <f.fields @for={{model.address}} @name="address" as |ff|>
          <ff.input @attr="street" />
        </f.fields>
      </FormBuilder>
    `);
    await fillIn('input[name*=street]', '');
    await blur('input[name*=street]');

    let errors = {
      address: {
        street: 'cannot be blank',
      },
    };

    assert.deepEqual(readErrors('person', ['address.street']), errors);
    assert.deepEqual(readErrors('person', errors), errors);

    assert.deepEqual(readErrors('person.address', ['street']), errors.address);
    assert.deepEqual(
      readErrors('person.address', errors.address),
      errors.address
    );
  });

  test('it reads nested array validation errors', async function (assert) {
    this.model = {
      children: [
        {
          firstName: 'Jan',
          validationsDummy: {
            firstName: {
              errors: ['cannot be blank'],
            },
          },
        },
        { firstName: 'Anna' },
      ],
    };
    await render(hbs`
      <FormBuilder @for={{model}} @name="person" as |f|>
        {{#each model.children as |child i|}}
          <f.fields @for={{child}} @name="child" @index={{i}} as |ff|>
            <ff.input @attr="firstName" />
          </f.fields>
        {{/each}}
      </FormBuilder>
    `);
    await fillIn('input[name*=firstName]', '');
    await blur('input[name*=firstName]');

    let errors = {
      children: [
        {
          firstName: 'cannot be blank',
        },
      ],
    };

    assert.deepEqual(readErrors('person', ['children.0.firstName']), errors);
    assert.deepEqual(readErrors('person', errors), errors);

    assert.deepEqual(
      readErrors('person.children.0', ['firstName']),
      errors.children[0]
    );
    assert.deepEqual(
      readErrors('person.children.0', errors.children[0]),
      errors.children[0]
    );
  });
});
