import EmberObject from '@ember/object';
import EmberValidationsMixin from 'ember-form-builder/mixins/ember-validations';
import FormBuilderBase from "ember-form-builder/models/form-builder";
import { module, test } from 'qunit';

const FormBuilder = FormBuilderBase.extend(EmberValidationsMixin);

module('Unit | Mixin | EmberValidationsMixin', function() {
  test("provides errors path for a given attribute", function(assert) {
    var model = EmberObject.create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.equal(builder.errorsPathFor('firstName'), 'object.errors.firstName');
  });
});
