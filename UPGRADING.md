# Upgrading 1.x to 2.x

## Removed translation attributes

Since Ember translation addons provide translation helpers we do not accept
translation keys as attributes anymore. You should pass a translated text instead.

### Before

```handlebars
{{#form-builder for=this action="submit" as |f|}}

  {{f.input
    "email"
    labelTranslation="custom.label.key"
    hintTranslation="custom.hint.key"
    placeholderTranslation="custom.placeholder.key"\
  }}
  {{f.submit translation="custom.submit.key"}}

{{/form-builder}}
```

### After

```handlebars
{{#form-builder for=this action="submit" as |f|}}

  {{f.input
    "email"
    label=(t "custom.label.key")
    hint=(t "custom.hint.key")
    placeholder=(t "custom.placeholder.key")
  }}
  {{f.submit text=(t "custom.submit.key")}}

{{/form-builder}}
```


## InputDefaultsMixin deprecation

To comply with [Ember's mixin deprecation](https://github.com/emberjs/rfcs/issues/534)
we have removed completely `InputDefaultsMixin`. This may require a bit more
coding from you, but things should be more clear and straightforward after this change.

### Before

Let’s consider this email input with auto-filled domain:

```javascript
import TextField from '@ember/component/text-field';
import InputDefaultsMixin from 'ember-form-builder/mixins/input-defaults';
import { computed } from '@ember/object';

export default TextField.extend(InputDefaultsMixin, {
  type: 'email',

  value: computed('modelValue', 'domain', {
    get() {
      return this.modelValue;
    },
    set(k, email) {
      if (!email.match('@')) {
        email += '@' + this.domain;
      }
      this.set('modelValue', email);
      return email;
    }
  })
});
```

```handlebars
{{#form-builder for=this action="submit" as |f|}}

  {{f.input "email" domain="gmail.com" placeholder="Your Gmail username"}}
  {{f.submit}}

{{/form-builder}}
```

In this case a lot of magic is happening in the `InputDefaultsMixin`. It maps
attributes passed by Ember Form Builder as follows:

Attribute | Default behavior
--- | ---
`inputElementId` | aliased as `inputId`
`inputName` | aliased as `name`
`modelValue` | aliased as `value` (but in our example it's overriden by the component)
`additionalAttributes` | each key in this hash is aliased under its name in the component (e.g. `placelholder`)


### After

Now all Ember Form Builder specific attributes are passed in a single `config` object.
That way it doesn't interfere with your component's code. It also means you'll have
to explicitly list properties that Ember Form Builder can pass to your component:

```javascript
import TextField from '@ember/component/text-field';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default TextField.extend({
  type: 'email',

  name:         reads('config.name'),
  placeholder:  reads('config.placeholder'),

  init() {
    this._super(...arguments);
    this.elementId = this.config.inputElementId;
  },

  value: computed('config.{value,domain}', {
    get() {
      return this.config.value;
    },
    set(k, email) {
      if (!email.match('@')) {
        email += '@' + this.config.domain;
      }
      this.set('config.value', email);
      return email;
    }
  })
});
```

```handlebars
{{#form-builder for=this action="submit" as |f|}}

  {{f.input "email" domain="gmail.com" placeholder="Your Gmail username"}}
  {{f.submit}}

{{/form-builder}}
```

## Renamed components

Some components were named in a convention originating from the 'SimpleForm'
name that was used by this addon originally. Also two of them were used to provide
merged configuration in consuming apps - this approach is not needed anymore.
If you were referencing these components, please rename your references as follows:

Before | After
--- | ---
`input-on` | `form-builder/input`
`submit-on` | `form-builder/submit`
`fields-builder` | `form-builder/fields`
`simple-input` | `form-builder/input`
`simple-label` | `form-builder/label`
`simple-submit` | `form-builder/submit`


## Loading, success and failure states

Previously Ember Form Builder included an undocumented feature that detected loading
(saving) and success/error status for EmberData models. This approach seemed too
obscure. We've replaced it with a closure action syntax.

### Before

```handlebars
{{#form-builder for=this action="submit" as |f|}}

  {{f.input "title"}}
  {{f.submit}}

{{/form-builder}}
```

### After

Either provide promise-returning closure action:

```handlebars
{{#form-builder for=this action=(action "submit") as |f|}}

  {{f.input "title"}}
  {{f.submit}}

{{/form-builder}}
```

```javascript
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submit() {
      return this.model.save();
    }
  }
})
```


...or pass `isLoading` and `status` params:

```handlebars
{{#form-builder for=this action=(action "submit") isLoading=isLoading status=status as |f|}}

  {{f.input "title"}}
  {{f.submit}}

{{/form-builder}}
```

```javascript
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submit() {
      this.set('isLoading', true);
      this.set('status', null);
      this.model.save().then(
        () => this.set('status', 'success'),
        () => this.set('status', 'failure')
      ).finally(
        () => this.set('isLoading', false)
      );
    }
  }
})
```
