import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { resolve, reject } from 'rsvp';
import sinon from 'sinon';

module('Integration | Component | form-builder', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{form-builder}}
    `);

    assert.dom('form').exists();
  });

  test('it sets model name', async function(assert) {
    this.set('object', { modelName: 'default-type' });

    await render(hbs`
      {{#form-builder for=object as="overriden-type" as |f|}}
        <div data-test-model-name>{{f.builder.modelName}}</div>
      {{/form-builder}}
    `);

    assert.dom('[data-test-model-name]').hasText('overriden-type');
  });

  test('it allows empty model name', async function(assert) {
    this.set('object', { modelName: 'default-type' });

    await render(hbs`
      {{#form-builder for=object as="" as |f|}}
        <div data-test-model-name>{{f.builder.modelName}}</div>
        <div data-test-translation-key>{{f.builder.translationKey}}</div>
        <div data-test-name>{{f.builder.name}}</div>
      {{/form-builder}}
    `);

    assert.dom('[data-test-model-name]').hasText('');
    assert.dom('[data-test-translation-key]').hasText('');
    assert.dom('[data-test-name]').hasText('');
  });

  test('it sets name', async function(assert) {
    await render(hbs`
      {{#form-builder as="sample-model" index=index as |f|}}
        <div data-test-name>{{f.builder.name}}</div>
      {{/form-builder}}
    `);

    assert.dom('[data-test-name]').hasText('sampleModel');

    this.set('index', 0);

    assert.dom('[data-test-name]').hasText('sampleModels[0]');
  });

  test('it handles submit', async function(assert) {
    this.set('object', {
      validate: sinon.stub().returns(reject())
    });
    this.set('didSubmit', sinon.stub());
    this.set('didFail', sinon.stub());

    await render(hbs`
      {{#form-builder for=object action=(action didSubmit) submitFailed=(action didFail) as |f|}}
        <div data-test-is-valid>{{f.builder.isValid}}</div>
        <input type="submit">
      {{/form-builder}}
    `);
    await click('input[type=submit]');

    assert.ok(this.object.validate.calledOnce, 'Validation was performed');
    assert.ok(this.didFail.calledOnce, 'Submit failed action was sent');
    assert.dom('[data-test-is-valid]').hasText('false', 'Form was invalid');

    this.set('object', {
      validate: sinon.stub().returns(resolve())
    });
    await click('input[type=submit]');

    assert.ok(this.didSubmit.calledOnce, 'Submit action was sent');
    assert.dom('[data-test-is-valid]').hasText('true', 'Form was valid');
  });
});
