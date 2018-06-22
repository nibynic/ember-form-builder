import EmberObject from '@ember/object';
import EmberCpValidationsMixin from 'ember-form-builder/mixins/ember-cp-validations';
import FormBuilderBase from "ember-form-builder/models/form-builder";
import { module, test } from 'qunit';

const FormBuilder = FormBuilderBase.extend(EmberCpValidationsMixin);

module('Unit | Mixin | EmberCpValidationsMixin', function() {
  test("provides errors path for a given attribute", function(assert) {
    var model = EmberObject.create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.equal(builder.errorsPathFor('firstName'), 'object.validations.attrs.firstName.messages');
  });
});
