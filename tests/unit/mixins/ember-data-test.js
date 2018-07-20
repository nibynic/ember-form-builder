import EmberObject from '@ember/object';
import EmberDataMixin from 'ember-form-builder/mixins/ember-data';
import FormBuilderBase from 'ember-form-builder/models/form-builder';
import { module, test } from 'qunit';

const FormBuilder = FormBuilderBase.extend(EmberDataMixin);

module('Unit | Mixin | EmberDataMixin', function() {
  test('detects model name', function(assert) {
    var model = EmberObject.extend({}).reopenClass({modelName: "fake-model"}).create();
    var builder = FormBuilder.create({
      model: model
    });
    assert.equal(builder.get('modelName'), 'fake-model');
  });

  test('detects EmberData model', function(assert) {
    var validModel = EmberObject.extend({}).reopenClass({modelName: "fake-model"}).create();
    var invalidModel = EmberObject.create();
    var builder = FormBuilder.create();

    assert.ok(builder.isModel(validModel), 'should return true');
    assert.notOk(builder.isModel(invalidModel), 'should return false');
  });
});
