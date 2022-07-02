import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | form-builder/submit', function (hooks) {
  setupRenderingTest(hooks);

  class IntlStub extends Service {
    translations = {
      'post.actions.submit': 'Zapisz post',
      'formBuilder.actions.submit': 'Zapisz',
    };

    t(key) {
      return this.translations[key];
    }

    exists(key) {
      return !!this.translations[key];
    }

    @tracked locale;
  }

  test('it renders a submit button', async function (assert) {
    await render(hbs`
      <FormBuilder::Submit data-test-submit/>
    `);

    assert.dom('[data-test-submit]').matchesSelector('button');
    assert.dom('[data-test-submit]').hasAttribute('type', 'submit');
    assert.dom('[data-test-submit]').hasText('Save');
  });

  test('it translates some attributes', async function (assert) {
    this.owner.register('service:intl', IntlStub);
    this.builder = {};

    await render(hbs`
      <FormBuilder::Submit data-test-submit @builder={{this.builder}} />
    `);

    assert.dom('[data-test-submit]').hasText('Zapisz');

    this.set('builder', { translationKey: 'post' });

    assert.dom('[data-test-submit]').hasText('Zapisz post');

    this.set('builder', { translationKey: 'inexistentKey' });

    assert.dom('[data-test-submit]').hasText('Zapisz');

    let service = this.owner.lookup('service:intl');
    service.translations['formBuilder.actions.submit'] = 'Save';
    service.locale = 'en';
    await settled();

    assert.dom('[data-test-submit]').hasText('Save');
  });

  test('it is disabled when the form builder is loading', async function (assert) {
    this.builder = { isLoading: false };

    await render(hbs`
      <FormBuilder::Submit data-test-submit @builder={{this.builder}} />
    `);

    assert.dom('[data-test-submit]').isNotDisabled();

    this.set('builder.isLoading', true);

    assert.dom('[data-test-submit]').isDisabled('has disabled attribute');
  });

  test('it allows extending via block syntax', async function (assert) {
    this.builder = { isLoading: false };

    await render(hbs`
      <FormBuilder::Submit data-test-submit @builder={{this.builder}} as |text builder|>
        Text: {{text}}
        Loading: {{builder.isLoading}}
      </FormBuilder::Submit>
    `);

    assert.dom('button').hasText('Text: Save Loading: false');
  });
});
