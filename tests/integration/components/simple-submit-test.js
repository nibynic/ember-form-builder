import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple-submit', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a submit button', async function(assert) {
    await render(hbs`
      {{simple-submit data-test-submit=true}}
    `);

    assert.dom('[data-test-submit]').matchesSelector('button');
    assert.dom('[data-test-submit]').hasAttribute('type', 'submit');
    assert.dom('[data-test-submit]').hasText('Save');
  });

  test('it translates some attributes', async function(assert) {
    const translations = {
      'post.actions.submit': 'Zapisz post',
      'some.weird.submit.translation.key': 'Zapisz dziw',
      'formBuilder.actions.submit': 'Zapisz'
    };
    this.owner.register('service:form-builder-translations', EmberObject.extend({
      t(key)      { return translations[key]; },
      exists(key) { return !!translations[key]; }
    }));
    this.set('builder', EmberObject.create());

    await render(hbs`
      {{simple-submit data-test-submit=true builder=builder translation=translation}}
    `);

    assert.dom('[data-test-submit]').hasText('Zapisz');

    this.set('builder.translationKey', 'post');

    assert.dom('[data-test-submit]').hasText('Zapisz post');

    this.set('builder.translationKey', 'inexistentKey');

    assert.dom('[data-test-submit]').hasText('Zapisz');

    this.set('translation', 'some.weird.submit.translation.key');

    assert.dom('[data-test-submit]').hasText('Zapisz dziw');
  });

  test('it is disabled when the form builder is loading', async function(assert) {
    this.set('builder', EmberObject.create({
      isLoading: false
    }));

    await render(hbs`
      {{simple-submit data-test-submit=true builder=builder}}
    `);

    assert.dom('[data-test-submit]').isNotDisabled();

    this.set('builder.isLoading', true);

    assert.dom('[data-test-submit]').isDisabled('has disabled attribute');
  });
});
