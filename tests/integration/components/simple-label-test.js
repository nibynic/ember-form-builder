import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple-label', function(hooks) {
  setupRenderingTest(hooks);

  test('it translates some attributes', async function(assert) {
    const translations = {
      'formBuilder.isRequired': 'Wymagane'
    };
    this.owner.register('service:form-builder-translations', EmberObject.extend({
      t(key)      { return translations[key]; },
      exists(key) { return !!translations[key]; }
    }));

    await render(hbs`
      {{simple-label attr="title" isRequired=true}}
    `);

    assert.dom('abbr').hasAttribute('title', 'Wymagane');

    translations['formBuilder.isRequired'] = 'Required';
    this.owner.lookup('service:form-builder-translations').set('locale', 'en');
    await settled();

    assert.dom('abbr').hasAttribute('title', 'Required');
  });
});
