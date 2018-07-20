import EmberObject from '@ember/object';
import EmberOrbitMixin from 'ember-form-builder/mixins/ember-orbit';
import FormBuilderBase from 'ember-form-builder/models/form-builder';
import { module, test } from 'qunit';

const FormBuilder = FormBuilderBase.extend(EmberOrbitMixin);

module('Unit | Mixin | EmberOrbitMixin', function() {
  test('detects model name', function(assert) {
    var model = EmberObject.extend({}).reopenClass({typeKey: 'fake-model'}).create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.equal(builder.get('modelName'), 'fake-model');
  });

  test('detects EmberOrbit model', function(assert) {
    var validModel = EmberObject.extend({}).reopenClass({typeKey: "fake-model"}).create();
    var invalidModel = EmberObject.create();
    var builder = FormBuilder.create();

    assert.ok(builder.isModel(validModel), 'should return true');
    assert.notOk(builder.isModel(invalidModel), 'should return false');
  });
});
