import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | form-builder/label', function (hooks) {
  setupRenderingTest(hooks);

  class TranslationsStub extends Service {
    translations = {
      'formBuilder.isRequired': 'Wymagane',
    };

    t(key) {
      return this.translations[key];
    }

    exists(key) {
      return !!this.translations[key];
    }
  }

  test('it translates some attributes', async function (assert) {
    this.owner.register('service:form-builder-translations', TranslationsStub);
    let service = this.owner.lookup('service:form-builder-translations');

    await render(hbs`
      <FormBuilder::Label @attr="title" @isRequired={{true}} />
    `);

    assert.dom('abbr').hasAttribute('title', 'Wymagane');

    service.translations['formBuilder.isRequired'] = 'Required';
    service.set('locale', 'en');
    await settled();

    assert.dom('abbr').hasAttribute('title', 'Required');
  });
});
