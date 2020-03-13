import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form-builder/submit', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a submit button', async function(assert) {
    await render(hbs`
      <FormBuilder::Submit @data-test-submit={{true}} />
    `);

    assert.dom('[data-test-submit]').matchesSelector('button');
    assert.dom('[data-test-submit]').hasAttribute('type', 'submit');
    assert.dom('[data-test-submit]').hasText('Save');
  });

  test('it translates some attributes', async function(assert) {
    const translations = {
      'post.actions.submit': 'Zapisz post',
      'formBuilder.actions.submit': 'Zapisz'
    };
    this.owner.register('service:intl', EmberObject.extend({
      t(key)      { return translations[key]; },
      exists(key) { return !!translations[key]; }
    }));
    this.set('builder', EmberObject.create());

    await render(hbs`
      <FormBuilder::Submit @data-test-submit={{true}} @builder={{builder}} />
    `);

    assert.dom('[data-test-submit]').hasText('Zapisz');

    this.set('builder.translationKey', 'post');

    assert.dom('[data-test-submit]').hasText('Zapisz post');

    this.set('builder.translationKey', 'inexistentKey');

    assert.dom('[data-test-submit]').hasText('Zapisz');

    translations['formBuilder.actions.submit'] = 'Save';
    this.owner.lookup('service:form-builder-translations').set('locale', 'en');
    await settled();

    assert.dom('[data-test-submit]').hasText('Save');
  });

  test('it is disabled when the form builder is loading', async function(assert) {
    this.set('builder', EmberObject.create({
      isLoading: false
    }));

    await render(hbs`
      <FormBuilder::Submit @data-test-submit={{true}} @builder={{builder}} />
    `);

    assert.dom('[data-test-submit]').isNotDisabled();

    this.set('builder.isLoading', true);

    assert.dom('[data-test-submit]').isDisabled('has disabled attribute');
  });
});
