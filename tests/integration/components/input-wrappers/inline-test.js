import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | input-wrappers/inline', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.config = {
      canValidate:  false,
      label:        'My field',
      validations: {
        errors:     ['cannot be blank', 'is too short']
      }
    };
    await render(hbs`
      <InputWrappers::Inline
        @config={{config}}
        @inputComponent={{component "inputs/string-input" data-test-my-input=true}}
        @labelComponent={{component "form-builder/label" data-test-my-label=true}}
      />
    `);

    assert.dom('[data-test-my-label]').hasText('My field');
    assert.dom('[data-test-my-label] [data-test-my-input]').exists();
    assert.dom('.hint').doesNotExist();
    assert.dom('.errors').doesNotExist();

    this.set('config.hint', 'Please type in your full email address');
    this.set('config.canValidate', true);

    assert.dom('.hint').hasText('Please type in your full email address');
    assert.dom('.errors').hasText('cannot be blank, is too short');
  });
});
