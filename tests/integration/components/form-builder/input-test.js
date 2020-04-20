import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | form-builder/input', function(hooks) {
  setupRenderingTest(hooks);

  const DEFAULT_TYPES = ['string', 'text', 'boolean', 'number', 'date', 'password', 'email', 'tel'];

  class FormBuilderMock {
    @tracked isValid    = true;
    @tracked isLoading  = false;
    @tracked name;
    @tracked object     = {};
    @tracked validationAdapter = {};
  }

  hooks.beforeEach(function() {
    this.builder = new FormBuilderMock();
  })


  test('it reflects value updates', async function(assert) {
    this.builder.object = {
      title: 'Testing testing 123'
    }

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('input').hasValue('Testing testing 123');

    this.set('builder.object.title', 'Another test!');

    assert.dom('input').hasValue('Another test!');
  });

  test('it proxies auxiliary attributes', async function(assert) {
    this.owner.register('component:inputs/fake-input', Component.extend({
      layout: hbs`
        <div data-test-additional-attributes>
          {{#each config.customProperty as |l|}} {{l}} {{/each}}
        </div>
      `
    }));

    this.set('customProperty', A(['a', 'b', 'c']));

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="fake" @builder={{this.builder}} @customProperty={{this.customProperty}} />
    `);

    assert.dom('[data-test-additional-attributes]').hasText('a b c', 'Initial options are correctly displayed');

    run(() => this.customProperty.pushObject('d'));
    await settled();

    assert.dom('[data-test-additional-attributes]').hasText('a b c d', 'Updated options are correctly displayed');

    this.set('customProperty', ['e']);

    assert.dom('[data-test-additional-attributes]').hasText('e', 'Replaced options are correctly displayed');
  });

  test('it renders input name and class', async function(assert) {
    this.builder.name = 'article';

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('input').hasAttribute('name', 'article[title]')
  });

  test('it uses provided wrapper', async function(assert) {
    this.builder.object = {
      title: 'Hello my input'
    };
    this.owner.register('component:input-wrappers/my-wrapper', Component.extend({
      layout: hbs`
        <div data-test-my-wrapper ...attributes>
          {{@labelComponent}}
          {{@inputComponent}}
          value: {{@config.value}}
        </div>
      `
    }));

    await render(hbs`
      <FormBuilder::Input @attr="title" @builder={{this.builder}} @wrapper="my-wrapper" />
    `);

    assert.dom('[data-test-my-wrapper]').exists();
    assert.dom('label').hasText('Title');
    assert.dom('input').hasValue('Hello my input');
    assert.dom(this.element).hasText('Title value: Hello my input');
  });

  test('it is disabled while saving or when explicitly disabled', async function(assert) {
    this.builder.isLoading = false;
    this.disabled = false;

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @disabled={{this.disabled}} @builder={{this.builder}} />
    `);

    assert.dom('input').isNotDisabled();

    this.builder.isLoading = true;
    await settled();

    assert.dom('input').isDisabled();

    this.builder.isLoading = false;
    this.set('disabled', true);
    await settled();

    assert.dom('input').isDisabled();
  });

  test('it reflects error updates', async function(assert) {
    this.builder.validationAdapter = {
      attributes: {
        title: {
          errors: ['can\'t be blank', 'is too short']
        }
      }
    };

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('.invalid-feedback').doesNotExist('No errors are displayed if wasn\'t focused out');

    this.builder.isValid = false;
    await settled();

    assert.dom('.invalid-feedback').hasText('can\'t be blank, is too short', 'The errors are displayed when builder is invalid');

    this.builder.isValid = true;
    await settled();

    assert.dom('.invalid-feedback').doesNotExist('Just to be sure it stopped displaying errors.');

    await triggerEvent('input', 'focusout');
    // for jQuery
    this.element.querySelector('input').focus();
    this.element.querySelector('input').blur();

    assert.dom('.invalid-feedback').hasText('can\'t be blank, is too short', 'The errors are displayed');
  });

  test('it renders a hint when provided', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} @hint={{hint}} />
    `);

    assert.dom('small').doesNotExist();

    this.set('hint', 'This is a hint');

    assert.dom('small').hasText('This is a hint');
  });

  test('it renders a placeholder when provided', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} @placeholder={{placeholder}} />
    `);

    assert.dom('input').doesNotHaveAttribute('placeholder');

    this.set('placeholder', 'This is a placeholder');

    assert.dom('input').hasAttribute('placeholder', 'This is a placeholder');
  });

  test('it humanizes the property for use as label', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="multiWordAttribute" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('label').hasText('Multi word attribute', 'The humanized label test is rendered');
  });

  test('it uses the provided label if it\'s provided', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} @label="Custom title" />
    `);

    assert.dom('label').hasText('Custom title', 'The custom label test is rendered');
  });

  test('it renders assigns the input\'s id as the label\'s for', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('label').hasAttribute('for', this.element.querySelector('input').id);
  });

  test('it renders no label when it\'s set to false', async function(assert) {
    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} @label={{false}} />
    `);

    assert.dom('label').doesNotExist();
  });

  test('it renders the required mark', async function(assert) {
    this.builder.validationAdapter = {
      attributes: {
        title: {
          required: true
        }
      }
    };

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('label abbr').hasText('*');
    assert.dom('label abbr').hasAttribute('title', 'Required');
  });

  DEFAULT_TYPES.forEach(function(type) {
    test(`it renders correctly for type ${type}`, async function(assert) {
      this.set('type', type);

      await render(hbs`
        <FormBuilder::Input @attr="title" @as={{type}} @builder={{this.builder}} />
      `);

      assert.dom('input, select, textarea').exists({ count: 1 }, `Rendered correctly for type ${type}`);
    });
  });

  test('it translates some attributes', async function(assert) {
    const translations = {
      'article.attributes.title':               'Tytuł artykułu',
      'article.hints.title':                    'Maksymalnie 255 znaków',
      'article.placeholders.title':             'Wpisz tytuł',
      'blogPost.attributes.title':              'Tytuł posta',
      'blogPost.hints.title':                   'Maksymalnie 45 znaków'
    };
    this.owner.register('service:intl', EmberObject.extend({
      t(key)      { return translations[key]; },
      exists(key) { return !!translations[key]; },
      locale: 'pl'
    }));

    await render(hbs`
      <FormBuilder::Input @attr="title" @as="string" @builder={{this.builder}} />
    `);

    assert.dom('label').hasText('Title', 'Label was humanized without translation key');
    assert.dom('small').doesNotExist('Hint was omitted without translation key');
    assert.dom('input').doesNotHaveAttribute('placeholder', 'Placeholder was omitted without translation key');

    this.set('builder.translationKey', 'blogPost');

    assert.dom('label').hasText('Tytuł posta');
    assert.dom('small').hasText('Maksymalnie 45 znaków');

    this.set('builder.translationKey', 'article');

    assert.dom('label').hasText('Tytuł artykułu');
    assert.dom('small').hasText('Maksymalnie 255 znaków');
    assert.dom('input').hasAttribute('placeholder', 'Wpisz tytuł');

    translations['article.attributes.title'] = 'Article title';
    this.owner.lookup('service:form-builder-translations').set('locale', 'en');
    await settled();

    assert.dom('label').hasText('Article title', 'should update after locale change');
  });
});
