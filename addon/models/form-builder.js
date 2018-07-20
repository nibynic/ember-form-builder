import { camelize } from '@ember/string';
import { Promise as EmberPromise } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  status: null,

  isValid: true,

  isLoading: computed("model.isSaving", "object.isLoading", function() {
    var objectIsLoading = this.get("object.isLoading");
    return objectIsLoading === true || objectIsLoading === false ?
      objectIsLoading : this.get("model.isSaving");
  }),

  children: computed(function() {
    return A([]);
  }),

  addChild(childFormBuilder) {
    this.get("children").addObject(childFormBuilder);
  },

  removeChild(childFormBuilder) {
    this.get("children").removeObject(childFormBuilder);
  },

  validate() {
    var validations = [];

    validations.push(this.validateObject());

    this.get("children").forEach((child) => {
      validations.push(child.validate());
    });

    return new EmberPromise((resolve, reject) => {
      EmberPromise.all(validations).then(
        () => { this.set("isValid", true); resolve(); },
        () => { this.set("isValid", false); reject(); }
      );
    });
  },

  model: computed('object.model', function() {
    if (this.isModel(this.get('object.model'))) {
      return this.get('object.model');
    } else {
      return this.get('object');
    }
  }),

  translationKey: computed('modelName', function() {
    return camelize(this.get('modelName') || '');
  }),

  _setSuccessStatus: function() {
    this.set("status", "success");
  },

  _setFailureStatus: function() {
    this.set("isValid", false);
    this.set("status", "failure");
  },

  // defined in validations mixin
  errorsPathFor() {},
  validateObject() {},

  // defined in data mixin
  modelName: '',
  isModel(/* modelCandidate */) {}
});
