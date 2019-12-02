# Upgrading 1.x to 2.x

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
