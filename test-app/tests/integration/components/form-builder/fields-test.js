import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | form-builder/fields', function (hooks) {
  setupRenderingTest(hooks);

  test('it registers and unregisters itself with the parent form builder', async function (assert) {
    let addChild = sinon.stub();
    let removeChild = sinon.stub();
    this.set('parent', { addChild, removeChild });
    this.set('isVisible', true);

    await render(hbs`
      {{#if this.isVisible}}
        <FormBuilder::Fields @on={{this.parent}} />
      {{/if}}
    `);

    assert.dom('form').doesNotExist();
    assert.ok(addChild.calledOnce);

    this.set('isVisible', false);

    assert.ok(removeChild.calledOnce);
  });

  test('it sets name', async function (assert) {
    this.parent = {
      name: 'sampleModel',
      addChild: (childBuilder) => {
        this.child = childBuilder;
        childBuilder.parent = this.parent;
      },
      removeChild() {},
    };
    this.index = 1;

    await render(hbs`
      <FormBuilder::Fields @on={{this.parent}} @name="sample-child" @index={{this.index}} as |f|>
        {{f.builder.name}}
      </FormBuilder::Fields>
    `);

    assert.dom(this.element).hasText('sampleModel[sampleChildren][1]');

    this.set('index', 2);

    assert.dom(this.element).hasText('sampleModel[sampleChildren][2]');

    this.set('child.parent', { name: '' });

    assert.dom(this.element).hasText('sampleChildren[2]');
  });
});
