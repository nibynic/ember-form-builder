# Ember Simple Form

[![Build Status](https://travis-ci.org/nibynic/ember-simple-form.svg)](https://travis-ci.org/nibynic/ember-simple-form)

## About

Ember Simple Form is an Ember Addon that enables you to assemble forms with
labels, validations, hints without repeating yourself. It's strongly inspired by a Rails gem [SimpleForm](https://github.com/plataformatec/simple_form).

__Note:__ this library only works with __Ember 1.11__* or newer and requires __Ember CLI__.

_* We rely strongly on the `component` helper that's been introduced in 1.11._

## Installation

```
npm install --save-dev nibynic/ember-simple-form
```

_Installation from GitHub is temporary until we publish to npm._

## Usage

```handlebars
{{#simple-form for=controller action="submit" as |f|}}

  {{input-on f "title"}}
  {{input-on f "category" collection=categories
             optionValuePath="content.id" optionLabelPath="content.fullName"}}
  {{input-on f "isPublished"}}
  {{input-on f "publishedOn" as="date"}}
  {{input-on f "price" unit="PLN" hint="Leave empty if this is a free article"}}

  {{submit-on f}}

{{/simple-form}}
```

### Built-in inputs

The following inputs types are built into Ember Simple Form:

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
import TextInput from "ember-simple-form/components/inputs/text-input";

export default TextInput.extend({
  init: function() {
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
{{input-on f "description" as="your-type"}}
```

### Validation with Ember Validations

Ember Simple Form supports validations out of the box. It will automatically mark inputs as erroneus and display error messages next to them whenever:

* the form's subject (`for=controller`, remember?) has an `errors` object and there is at least one error in it for the input's attribute (e.g. `controller.errors.attributeName` contains an array of error messages) __and__
* a user has focused out of the input at least once.

This is compatible both with Ember Data's server-provided validation messages and with client-side validations provided by Ember Validation. However none of those libraries is required by Ember Simple Form.

### Translations with Ember-I18n

You can easily cusomize labels and other texts by providing values through attributes in your templates but if your app is or might become international you might wish to integrate the forms with an i18n library.
Ember Simple Form only supports Ember-I18n at the moment, however other solutions might be integrated in the future.

Ember Simple Form automatically detects Ember-I18n and tries to guess the translation keys.

 | label | hint | submit | required
--- | --- | --- | --- | ---
Explicit | `label="My attribute"` | `hint="My hint"` | `text="My submit"` | `not possible`
Custom translation key | `labelTranslation="custom.label.key"` | `hintTranslation="custom.hint.key"` | `translation="custom.submit.key"` | `not possible`
Custom form translation key: `{{#form-for translationKey="custom.key"}}` | Looks up `custom.key.attributes.attribute` | Looks up `custom.key.hints.attribute` | Looks up `custom.key.actions.submit` | `not possible`
Underlying Ember Data model's typeKey (e.g. `article`) | Looks up `article.attributes.attribute` | Looks up `article.hints.attribute` | Looks up `article.actions.submit` | `not possible`
Default | humanizes attribute name | empty | Looks up `simpleForm.actions.submit` | Looks up `simpleForm.isRequired`
Without `Ember.I18n` | humanizes attribute name | empty | "Save" | "Required"

## Configuration

### Changing default classes

Ember Simple Form exposes all the class names it uses via environment configuration. To override them, specify your values in `config/environment.js` under `simpleForm` key (e.g. `ENV.simpleForm.wrapperClass = "form-input"`).

Those are the default classes:

```js
{
  wrapperClass: "input", // input's root element
  wrapperWithErrorsClass: "input-with-errors", // input's root element, when there are errors on this attribute
  wrapperWithUnitClass: "has-unit", // input's root element, when a unit has been specified
  unitClass: "input-unit", // unit element
  errorsClass: "errors", // errors container
  fieldClass: "field", // wrapper around input, errors, hint and unit
  inputClass: "input-control", // the actual input
  hintClass: "hint" // hint element
}
```

### Overriding templates

You'll probably want to customize the markup Ember Simple Form generates. For that, you can override the default templates.

Start by copying all or some of the [default templates](https://github.com/nibynic/ember-simple-form/tree/master/app/templates/components) to your app. Then modify whatever you want.

Remember that Ember Simple Form is not yet stable and the templates are subject to change before we reach 1.0.0. Until then monitor the changes closely when upgrading.

## Legal ##

[nibynic](http://nibynic.com) &copy; 2015

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)
