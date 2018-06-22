import EmberObject from '@ember/object';
import EmberValidationsMixin from 'ember-form-builder/mixins/ember-validations';
import FormBuilderBase from "ember-form-builder/models/form-builder";
import { resolve, reject } from 'rsvp';
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

  test("provides normalized validate()", async function(assert) {
    var object = EmberObject.create({
      validate: reject
    });
    var builder = FormBuilder.create({
      object: object,
      model: {}
    });

    assert.expect(2);

    await builder.validateObject().then(() => {
      assert.ok(false, 'promise should not be resolved when model is invalid');
    }, () => {
      assert.ok(true, 'promise should be rejected when model is invalid');
    });

    object.validate = resolve;
    await builder.validateObject().then(() => {
      assert.ok(true, 'promise should be resolved when model is valid');
    }, () => {
      assert.ok(false, 'promise should not be rejected when model is valid');
    });
  });
});
