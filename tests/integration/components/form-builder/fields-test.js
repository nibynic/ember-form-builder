import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | form-builder/fields', function(hooks) {
  setupRenderingTest(hooks);

  test('it registers and unregisters itself with the parent form builder', async function(assert) {
    let addChild = sinon.stub();
    let removeChild = sinon.stub();
    this.set('parent', { addChild, removeChild });
    this.set('isVisible', true)

    await render(hbs`
      {{#if isVisible}}
        {{form-builder/fields on=parent}}
      {{/if}}
    `);

    assert.ok(addChild.calledOnce);

    this.set('isVisible', false);

    assert.ok(removeChild.calledOnce);
  });

  test('it sets name', async function(assert) {
    this.set('parent', {
      name: 'sampleModel',
      addChild: (childBuilder) => {
        childBuilder.set('parent', this.parent);
      },
      removeChild() {}
    });

    await render(hbs`
      {{#form-builder/fields on=parent as="sample-child" as |f|}}
        {{f.builder.name}}
      {{/form-builder/fields}}
    `);

    assert.dom(this.element).hasText('sampleModel[sampleChild]');
  });
});
