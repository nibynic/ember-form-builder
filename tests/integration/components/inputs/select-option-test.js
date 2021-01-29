import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | inputs/select-option', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.option = {
      content: 'A',
      label: 'Option A',
      value: 'a'
    };
    this.selectedValue = 'A';

    await render(hbs`<Inputs::SelectOption @content={{this.option}} @selectedValue={{this.selectedValue}} />`);

    assert.dom('option').hasAttribute('value', 'a');
    assert.dom('option').hasText('Option A');
    assert.dom('option').matchesSelector(':checked');

    this.set('selectedValue', 'B');

    assert.dom('option').matchesSelector(':not(:checked)');

    this.set('selectedValue', ['A', 'B']);

    assert.dom('option').matchesSelector(':checked');

    this.set('selectedValue', ['B', 'C']);

    assert.dom('option').matchesSelector(':not(:checked)');
  });

  test('it can be extended via block syntax', async function(assert) {
    this.option = {
      content: 'A',
      label: 'Option A',
      value: 'a'
    };
    this.selectedValue = 'A';

    await render(hbs`
      <Inputs::SelectOption @content={{this.option}} @selectedValue={{this.selectedValue}} as |selected|>
        Selected: {{selected}}
      </Inputs::SelectOption>
    `);

    assert.dom('option').doesNotExist();
    assert.dom(this.element).hasText('Selected: true');
  });
});
