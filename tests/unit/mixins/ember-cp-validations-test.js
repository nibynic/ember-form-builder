import EmberObject from '@ember/object';
import EmberCpValidationsMixin from 'ember-form-builder/mixins/ember-cp-validations';
import FormBuilderBase from "ember-form-builder/models/form-builder";
import { resolve } from 'rsvp';
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

  test("provides validations path for a given attribute", function(assert) {
    var model = EmberObject.create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.equal(builder.validationsPathFor('firstName'), 'object.validations.attrs.firstName.options');
  });

  test("normalizes validations", function(assert) {
    var model = EmberObject.create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.deepEqual(builder.normalizeValidations({
      presence: { presence: true },
      number: { gt: 1, gte: 2, lt: 3, lte: 4, integer: true }
    }), {
      required: true,
      number: { gt: 1, gte: 2, lt: 3, lte: 4, integer: true }
    });
  });

  test("provides normalized validate()", async function(assert) {
    var object = EmberObject.create({
      validate() {
        return resolve({
          model: this,
          validations: this.get('validations')
        });
      },
      validations: {
        isValid: false
      }
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

    object.set('validations.isValid', true);
    await builder.validateObject().then(() => {
      assert.ok(true, 'promise should be resolved when model is valid');
    }, () => {
      assert.ok(false, 'promise should not be rejected when model is valid');
    });
  });
});
