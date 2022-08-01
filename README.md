# Ember Form Builder

![Build Status](https://github.com/nibynic/ember-form-builder/actions/workflows/node.js.yml/badge.svg)
[![npm version](https://badge.fury.io/js/ember-form-builder.svg)](https://badge.fury.io/js/ember-form-builder)
[![Ember Observer Score](https://emberobserver.com/badges/ember-form-builder.svg)](https://emberobserver.com/addons/ember-form-builder)

## About

Ember Form Builder is an Ember Addon that enables you to assemble forms with
labels, validations, hints without repeating yourself. It's strongly inspired by a Rails gem [SimpleForm](https://github.com/plataformatec/simple_form).

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Installation

```
ember install ember-form-builder
```

## Usage

```handlebars
<FormBuilder @for={{this}} @action={{this.submit}} as |f|>

  <f.input @attr='title' />
  <f.input @attr='category' @collection={{categories}} />
  <f.input @attr='isPublished' />
  <f.input @attr='publishedOn' @as='date' />
  <f.input @attr='price' @hint='Leave empty if this is a free article' />

  <f.submit />

</FormBuilder>
```

### Built-in inputs

The following inputs types are built into Ember Form Builder:

| Type         | Guessed when                                                                                            | HTML form                                          |
| ------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `boolean`    | attribute name begins with `is`, `has` or `did`; underlying model's attribute is a `DS.attr("boolean")` | `<input type="checkbox" />`                        |
| `collection` | a `collection` attribute is present                                                                     | `<select>`                                         |
| `date`       | underlying model's attribute is a `DS.attr("date")`                                                     | `<input type="date" />`                            |
| `email`      | attribute name contains `email`                                                                         | `<input type="email" />`                           |
| `number`     | underlying model's attribute is a `DS.attr("number")`                                                   | `<input type="number" />`                          |
| `password`   | attribute name contains `password`                                                                      | `<input type="password" />`                        |
| `checkboxes` | _never_                                                                                                 | collection of `<input type="radio" />` with labels |
| `string`     | underlying model's attribute is a `DS.attr("string")`                                                   | `<input type="text" />`                            |
| `text`       | _never_                                                                                                 | `<textarea>`                                       |

### Extending built-in inputs

You can easily extend any of the above inputs by overriding them and requiring addon's original component. Like this:

```js
// In app/components/inputs/text-input.js
import OriginalTextInput from 'ember-form-builder/components/inputs/text-input';
import { action, set } from '@ember/object';

export default class TextInput extends OriginalTextInput {
  @action
  handleChange(e) {
    set(this, 'args.config.value', e.target.value.trim());
  }
}
```

### Custom inputs

To provide your own input types simply implement a component named `your-type-input` and put it into `components/inputs` folder. Like this:

```hbs
{{! In app/components/inputs/your-type-input.hbs }}
<input
  type='range'
  id={{@config.inputElementId}}
  name={{@config.name}}
  value={{@config.value}}
  {{on 'change' this.handleChange}}
/>
```

You can then use your input using the `as` option:

```handlebars
{{f.input 'description' as='your-type'}}
```

### Validation

Ember Form Builder will automatically mark inputs as erroneus and display error messages next to them whenever:

- the input's attribute is invalid **and**
- a user has focused out of the input at least once.

Ember Form Builder supports these validation addons:

- [Ember Validations](https://github.com/DockYard/ember-validations) (default) - this is compatible also with Ember Data's server-provided validation messages,
- [Ember CP Validations](https://github.com/DockYard/ember-validations)

You can set your choice in the [configuration](#configuration). None of those libraries is required by Ember Form Builder.

### Data layer

Ember Form Builder will automatically detect model name and then use it in input name generation and translation lookup.

Ember Form Builder supports these data addons:

- [Ember Data](https://github.com/emberjs/data) (default),
- [Ember-Orbit](https://github.com/orbitjs/ember-orbit)

You can set your choice in the [configuration](#configuration). None of those libraries is required by Ember Form Builder.

### Translations

You can easily cusomize labels and other texts by providing values through attributes in your templates but if your app is or might become international you might wish to integrate the forms with an internationalization library.
Ember Form Builder supports `ember-intl` and `ember-i18n` at the moment, however other solutions might be integrated in the future.

Ember Form Builder automatically detects internationalization addon and tries to guess the translation keys.

| use case                                                                    | label                                      | hint                                  | placeholder                                  | submit                                    | required                          |
| --------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------- | -------------------------------------------- | ----------------------------------------- | --------------------------------- |
| Explicit                                                                    | `@label="My attribute"`                    | `@hint="My hint"`                     | `@placeholder="My placeholder"`              | `@text="My submit"`                       | `not possible`                    |
| Custom form translation key: `<FormBuilder @translationKey="custom.key" />` | Looks up `custom.key.attributes.attribute` | Looks up `custom.key.hints.attribute` | Looks up `custom.key.placeholders.attribute` | Looks up `custom.key.actions.submit`      | `not possible`                    |
| Underlying model's name (e.g. `article`)                                    | Looks up `article.attributes.attribute`    | Looks up `article.hints.attribute`    | Looks up `article.actions.submit`            | Looks up `article.placeholders.attribute` | `not possible`                    |
| Default                                                                     | humanizes attribute name                   | empty                                 | empty                                        | Looks up `formBuilder.actions.submit`     | Looks up `formBuilder.isRequired` |
| Without `ember-intl` or `ember-i18n`                                        | humanizes attribute name                   | empty                                 | empty                                        | "Save"                                    | "Required"                        |

## Customization

### Changing input templates and CSS classes

Ember Form Builder uses input wrappers to allow you control the generated HTML and CSS.
Input wrapper is a component that receives `@inputComponent`, `@labelComponent` and `@config` arguments.

`@inputComponent` and `@labelComponent` are preconfigured component instances, so you can
easily render them in any place you need.

`@config` is a hash containing some predefined keys (`inputElementId`, `name`, `value`, `texts`,
`validations`, `canValidate`), as well as all arguments that you pass to
the `<f.input />` call.

```handlebars
{{! app/components/input-wrappers/my-wrapper.hbs }}
<div class='my-input'>
  <@labelComponent />
  <div class='my-field'>
    <@inputComponent class='my-input-control' />
  </div>
  {{#if @config.validations.errors}}
    <div class='my-errors'>{{@config.validations.errors}}</div>
  {{/if}}
</div>
```

Ember Form Builder ships with `default` and `inline` wrappers that are compatible
with [Bootstrap](https://getbootstrap.com/) form markup. You can overwrite them or
define your own wrappers. Then to select a wrapper for a specific input, just pass
its name in the `@wrapper` attribute:

```handlebars
<FormBuilder @for={{this}} @action={{this.submit}} as |f|>

  <f.input @attr='title' @wrapper='my-wrapper' />
  <f.input @attr='isPublished' @wrapper='inline' />
  <f.submit />

</FormBuilder>
```

### Configuration

Ember Form Builder can be configured via environment configuration. To override them, specify your values in `config/environment.js` under `formBuilder` key (e.g. `ENV.formBuilder.validationsAddon = 'ember-cp-validations'`).

Those are the default values:

```js
{
  validationsAddon: 'ember-validations', // name of the validations addon. Supported values: "ember-validations" and "ember-cp-validations"
  dataAddon: 'ember-data' // name of the data addon. Supported values: "ember-data" and "ember-orbit"
}
```

## Test support

Ember Form Builder ships with several test helpers that allow you to easily read
and write form data.

In the examples below we use this component:

```handlebars
{{! app/components/my-form }}
<FormBuilder @for={{@model}} @name='person' as |f|>
  <f.input @attr='firstName' />
  <f.input @attr='age' @as='number' />
  {{#each @model.children as |child i|}}
    <f.fields @for={{child}} @name='child' @index={{i}} as |ff|>
      <ff.input @attr='firstName' />
    </f.fields>
  {{/each}}
</FormBuilder>
```

### Reading form data

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { readForm } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Components | my-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it displays model data', async function(assert) {
    this.model = {
      firstName:  'Jan',
      age:        37,
      children: [
        { firstName: 'Anna' }
      ]
    };
    await render(hbs`<MyForm @model={{this.model}} />`);

    // pass a list of attributes to read...
    assert.deepEqual(readForm('person', ['firstName', 'age', 'children.0.firstName']), this.model);

    // ...or just an object (its keys will be converted to paths)
    assert.deepEqual(readForm('person', this.model), this.model);
  });
```

### Filling out forms

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { fillForm, pick } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Components | my-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it updates data', async function(assert) {
    this.model = {
      firstName:  'Jan',
      age:        37,
      children: [
        { firstName: 'Anna' }
      ]
    };
    await render(hbs`<MyForm @model={{this.model}} />`);

    let newData = {
      firstName:  'Viktor',
      age:        32,
      children: [
        { firstName: 'Joanna' }
      ]
    };

    await fillForm('person', newData);

    assert.deepEqual(this.model, newData);

    // if your model includes attributes that should not be compared, use the pick() helper:

    this.model.lastName = 'Larsson';

    assert.deepEqual(pick(this.model, newData), newData);
  });
```

### Reading validation errors

```js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { fillForm, readErrors } from 'ember-form-builder/test-support';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Components | my-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it validates data', async function(assert) {
    this.model = {
      age:  37
    };
    await render(hbs`<MyForm @model={{this.model}} />`);
    await fillForm('person', {
      age:  2
    });

    let errors = {
      age: 'must be greater than or equal to 16'
    }

    assert.deepEqual(readErrors('person', errors), errors);
  });
```

## Upgrading

Please check out the [upgrading documentation](UPGRADING.md).

## Legal

[nibynic](http://nibynic.com) &copy; 2015

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
