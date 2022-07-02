import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Promise, resolve, reject } from 'rsvp';
import sinon from 'sinon';

module('Integration | Component | form-builder', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <FormBuilder novalidate />
    `);

    assert.dom('form').exists();
    assert.dom('form').hasAttribute('novalidate');
  });

  test('it sets model name', async function (assert) {
    this.set('object', { modelName: 'default-type' });

    await render(hbs`
      <FormBuilder @for={{this.object}} @name="overriden-type" as |f|>
        <div data-test-model-name>{{f.builder.modelName}}</div>
      </FormBuilder>
    `);

    assert.dom('[data-test-model-name]').hasText('overriden-type');
  });

  test('it allows empty model name', async function (assert) {
    this.set('object', { modelName: 'default-type' });

    await render(hbs`
      <FormBuilder @for={{this.object}} @name="" as |f|>
        <div data-test-model-name>{{f.builder.modelName}}</div>
        <div data-test-translation-key>{{f.builder.translationKey}}</div>
        <div data-test-name>{{f.builder.name}}</div>
      </FormBuilder>
    `);

    assert.dom('[data-test-model-name]').hasText('');
    assert.dom('[data-test-translation-key]').hasText('');
    assert.dom('[data-test-name]').hasText('');
  });

  test('it sets name', async function (assert) {
    await render(hbs`
      <FormBuilder @name="sample-model" @index={{this.index}} as |f|>
        <div data-test-name>{{f.builder.name}}</div>
      </FormBuilder>
    `);

    assert.dom('[data-test-name]').hasText('sampleModel');

    this.set('index', 0);

    assert.dom('[data-test-name]').hasText('sampleModels[0]');
  });

  module('submitting', function (hooks) {
    hooks.beforeEach(async function () {
      this.validate = sinon.stub();
      this.submit = sinon.stub();
      this.didFail = sinon.stub();

      await render(hbs`
        <FormBuilder @for={{this}} @action={{this.submit}} @submitFailed={{this.didFail}} as |f|>
          <div data-test-is-valid>{{f.builder.isValid}}</div>
          <div data-test-status>{{f.builder.status}}</div>
          {{!-- template-lint-disable require-input-label --}}
          <input type="submit">
        </FormBuilder>
      `);
    });

    test('it doesn’t submit if validation failed', async function (assert) {
      this.validate.returns(reject());

      await click('input[type=submit]');

      assert.ok(this.validate.calledOnce);
      assert.ok(this.submit.notCalled);
      assert.ok(this.didFail.calledOnce);
      assert.dom('[data-test-is-valid]').hasText('false');
      assert.dom('[data-test-status]').hasText('failure');
    });

    test('it handles successful submit', async function (assert) {
      this.validate.returns(resolve());
      this.submit.returns(resolve());

      await click('input[type=submit]');

      assert.ok(this.validate.calledOnce);
      assert.ok(this.submit.calledOnce);
      assert.ok(this.didFail.notCalled);
      assert.dom('[data-test-is-valid]').hasText('true');
      assert.dom('[data-test-status]').hasText('success');
    });

    test('it handles failed submit', async function (assert) {
      this.validate.returns(resolve());
      this.submit.returns(reject());

      await click('input[type=submit]');

      assert.ok(this.validate.calledOnce);
      assert.ok(this.submit.calledOnce);
      assert.ok(this.didFail.calledOnce);
      assert.dom('[data-test-is-valid]').hasText('true');
      assert.dom('[data-test-status]').hasText('failure');
    });

    test('it doesn’t override provided status property', async function (assert) {
      this.validate.returns(resolve());
      this.submit.returns(resolve());
      this.set('status', 'failure');
      await render(hbs`
        <FormBuilder @for={{this}} @action={{this.submit}} @status={{this.status}} as |f|>
          <div data-test-status>{{f.builder.status}}</div>
          {{!-- template-lint-disable require-input-label --}}
          <input type="submit">
        </FormBuilder>
      `);

      assert.dom('[data-test-status]').hasText('failure');

      await click('input[type=submit]');

      assert.dom('[data-test-status]').hasText('failure');

      this.set('status', 'success');

      assert.dom('[data-test-status]').hasText('success');
    });
  });

  module('loading state', function (hooks) {
    hooks.beforeEach(async function () {
      this.validate = sinon.stub().returns(resolve());
      this.submit = sinon
        .stub()
        .returns(new Promise((r) => (this.resolvePromise = r)));
    });

    test('it detects loading state', async function (assert) {
      await render(hbs`
        <FormBuilder @for={{this}} @action={{this.submit}} as |f|>
          {{#if f.builder.isLoading}}
            <div data-test-is-loading></div>
          {{/if}}
          {{!-- template-lint-disable require-input-label --}}
          <input type="submit">
        </FormBuilder>
      `);

      click('input[type=submit]');
      await waitFor('[data-test-is-loading]');

      assert.dom('[data-test-is-loading]').exists();

      this.resolvePromise();
      await settled();

      assert.dom('[data-test-is-loading]').doesNotExist();
    });

    test('it doesn’t crash if promise is resolved after component was destroyed', async function (assert) {
      await render(hbs`
        {{#unless this.hideComponent}}
          <FormBuilder @for={{this}} @action={{this.submit}} as |f|>
            {{#if f.builder.isLoading}}
              <div data-test-is-loading></div>
            {{/if}}
            {{!-- template-lint-disable require-input-label --}}
            <input type="submit">
          </FormBuilder>
        {{/unless}}
      `);

      click('input[type=submit]');
      await waitFor('[data-test-is-loading]');

      this.set('hideComponent', true);

      this.resolvePromise();
      await settled();

      assert.ok(true);
    });

    test('it doesn’t override provided isLoading property', async function (assert) {
      this.set('isLoading', true);

      await render(hbs`
        <FormBuilder @for={{this}} @action={{this.submit}} @isLoading={{this.isLoading}} as |f|>
          {{#if f.builder.isLoading}}
            <div data-test-is-loading></div>
          {{/if}}
          {{!-- template-lint-disable require-input-label --}}
          <input type="submit">
        </FormBuilder>
      `);

      assert.dom('[data-test-is-loading]').exists();

      click('input[type=submit]');
      await waitFor('[data-test-is-loading]');

      assert.dom('[data-test-is-loading]').exists();

      this.resolvePromise();
      await settled();

      assert.dom('[data-test-is-loading]').exists();

      this.set('isLoading', false);

      assert.dom('[data-test-is-loading]').doesNotExist();
    });
  });
});
