# Ember Form Builder

[![Build Status](https://travis-ci.org/nibynic/ember-form-builder.svg)](https://travis-ci.org/nibynic/ember-form-builder)
[![Ember Observer Score](https://emberobserver.com/badges/ember-form-builder.svg)](https://emberobserver.com/addons/ember-form-builder)

## About

Ember Form Builder is an Ember Addon that enables you to assemble forms with
labels, validations, hints without repeating yourself. It's strongly inspired by a Rails gem [SimpleForm](https://github.com/plataformatec/simple_form).

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

## Installation

```
npm install --save-dev ember-form-builder
```

## Usage

```handlebars
{{#form-builder for=this action=(action "submit") as |f|}}

  {{f.input "title"}}
  {{f.input "category" collection=categories
             optionValuePath="content.id" optionLabelPath="content.fullName"}}
  {{f.input "isPublished"}}
  {{f.input "publishedOn" as="date"}}
  {{f.input "price" hint="Leave empty if this is a free article"}}

  {{f.submit}}

{{/form-builder}}
```

### Built-in inputs

The following inputs types are built into Ember Form Builder:

Type | Guessed when | HTML form
--- | --- | ---
`boolean` | attribute name begins with `is`, `has` or `did`; underlying model's attribute is a `DS.attr("boolean")` | `<input type="checkbox" />`
`collection` | a `collection` attribute is present | `<select>`
`date` | underlying model's attribute is a `DS.attr("date")` | `<input type="date" />`
`email` | attribute name contains `email` | `<input type="email" />`|
`number` | underlying model's attribute is a `DS.attr("number")` | `<input type="number" />`|
`password` | attribute name contains `password` | `<input type="password" />`|
`checkboxes` | _never_ | collection of `<input type="radio" />` with labels
`string` | underlying model's attribute is a `DS.attr("string")` | `<input type="text" />`|
`text` | _never_ | `<textarea>`

### Extending built-in inputs

You can easily extend any of the above inputs by overriding them and requiring addon's original component. Like this:

```js
// In app/components/inputs/text-input.js
import TextInput from "ember-form-builder/components/inputs/text-input";

export default TextInput.extend({
  init() {
    this._super();
    this.attributeBindings.push("customAttribute");
  },

  customAttribute: Ember.computed(function() {
    /* some code */
  })
});

```

### Custom inputs

To provide your own input types simply implement a component named `your-type-input` and put it into `components/inputs` folder. Like this:

```js
// In app/components/inputs/your-type-input.js
import Ember from "ember";

export default Ember.Component.extend({});
```

You can then use your input using the `as` option:

```handlebars
{{f.input "description" as="your-type"}}
```

### Validation

Ember Form Builder will automatically mark inputs as erroneus and display error messages next to them whenever:

* the input's attribute is invalid __and__
* a user has focused out of the input at least once.

Ember Form Builder supports these validation addons:

* [Ember Validations](https://github.com/DockYard/ember-validations) (default) - this is compatible also with Ember Data's server-provided validation messages,
* [Ember CP Validations](https://github.com/DockYard/ember-validations)

You can set your choice in the [configuration](#configuration). None of those libraries is required by Ember Form Builder.

### Data layer

Ember Form Builder will automatically detect model name and then use it in input name generation and translation lookup.

Ember Form Builder supports these data addons:

* [Ember Data](https://github.com/emberjs/data) (default),
* [Ember-Orbit](https://github.com/orbitjs/ember-orbit)

You can set your choice in the [configuration](#configuration). None of those libraries is required by Ember Form Builder.

### Translations

You can easily cusomize labels and other texts by providing values through attributes in your templates but if your app is or might become international you might wish to integrate the forms with an internationalization library.
Ember Form Builder supports `ember-intl` and `ember-i18n` at the moment, however other solutions might be integrated in the future.

Ember Form Builder automatically detects internationalization addon and tries to guess the translation keys.

use case | label | hint | placeholder | submit | required
--- | --- | --- | --- | ---
Explicit | `label="My attribute"` | `hint="My hint"` | `placeholder="My placeholder"` | `text="My submit"` | `not possible`
Custom form translation key: `{{#form-builder translationKey="custom.key"}}` | Looks up `custom.key.attributes.attribute` | Looks up `custom.key.hints.attribute` | Looks up `custom.key.placeholders.attribute` | Looks up `custom.key.actions.submit` | `not possible`
Underlying model's name (e.g. `article`) | Looks up `article.attributes.attribute` | Looks up `article.hints.attribute` | Looks up `article.actions.submit` | Looks up `article.placeholders.attribute` | `not possible`
Default | humanizes attribute name | empty | empty | Looks up `formBuilder.actions.submit` | Looks up `formBuilder.isRequired`
Without `ember-intl` or `ember-i18n` | humanizes attribute name | empty | empty | "Save" | "Required"

## Customization

### Changing input templates and CSS classes

Ember Form Builder uses input wrappers to allow you control the generated HTML and CSS.
Input wrapper is a component that receives `inputComponent`, `labelComponent` and `config` arguments.

`inputComponent` and `labelComponent` are preconfigured component instances, so you can
easily render them in any place you need.

`config` is a hash containing some predefined keys (`inputElementId`, `name`, `value`, `label`, `placeholder`, `hint`, `unit`,
`validations`, `canValidate`), as well as all attributes that you pass to
the `{{f.input}}` call.

```handlebars
{{!-- app/components/input-wrappers/my-wrapper --}}
<div class="my-input">
  {{component labelComponent}}
  <div class="my-field">
    {{component inputComponent class="my-input-control"}}
  </div>
  {{#if config.validations.errors}}
    <div class="my-errors">{{config.validations.errors}}</div>
  {{/if}}
</div>
```

Ember Form Builder ships with `default` and `inline` wrappers. You can overwrite them or
define your own wrappers. Then to select a wrapper for a specific input, just pass
its name in the `wrapper` attribute:

```handlebars
{{#form-builder for=this action=(action "submit") as |f|}}

  {{f.input "title" wrapper="my-wrapper"}}
  {{f.input "isPublished" wrapper="inline"}}
  {{f.submit}}

{{/form-builder}}
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

## Upgrading ##

Please check out the [upgrading documentation](UPGRADING.md).

## Legal ##

[nibynic](http://nibynic.com) &copy; 2015

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
