import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | fields-builder', function(hooks) {
  setupRenderingTest(hooks);

  test('it registers and unregisters itself with the parent form builder', async function(assert) {
    let addChild = sinon.stub();
    let removeChild = sinon.stub();
    this.set('parent', { addChild, removeChild });
    this.set('isVisible', true)

    await render(hbs`
      {{#if isVisible}}
        {{fields-builder on=parent}}
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
      {{#fields-builder on=parent as="sample-child" as |f|}}
        {{f.builder.name}}
      {{/fields-builder}}
    `);

    assert.dom(this.element).hasText('sampleModel[sampleChild]');
  });
});
