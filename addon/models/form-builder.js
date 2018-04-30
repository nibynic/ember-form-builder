import { camelize } from '@ember/string';
import { isPresent, isBlank } from '@ember/utils';
import { resolve, Promise as EmberPromise } from 'rsvp';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import findModel from "ember-form-builder/utilities/find-model";

export default EmberObject.extend({
  status: null,

  isLoading: computed("model.isSaving", "object.isLoading", function() {
    var objectIsLoading = this.get("object.isLoading");
    return objectIsLoading === true || objectIsLoading === false ?
      objectIsLoading : this.get("model.isSaving");
  }),


  children: computed(function() {
    return A([]);
  }),

  init: function() {
    if (this.get("isEmberData") && this.get("model").on) {
      this.get("model").on("didCreate", this, this._setSuccessStatus);
      this.get("model").on("didUpdate", this, this._setSuccessStatus);
      this.get("model").on("becameInvalid", this, this._setFailureStatus);
    }
  },

  willDestroy: function() {
    if (this.get("isEmberData") && this.get("model").off) {
      this.get("model").off("didCreate", this, this._setSuccessStatus);
      this.get("model").off("didUpdate", this, this._setSuccessStatus);
      this.get("model").off("becameInvalid", this, this._setFailureStatus);
    }
  },

  addChild(childFormBuilder) {
    this.get("children").addObject(childFormBuilder);
  },

  removeChild(childFormBuilder) {
    this.get("children").removeObject(childFormBuilder);
  },

  validate() {
    var validations = [];

    if (this.get("object.validate")) {
      validations.push(this.get("object").validate());
    } else {
      validations.push(resolve(true));
    }

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

  model: computed("object", function() {
    return findModel(this.get("object"));
  }),

  isEmberData: computed("model", function() {
    return isPresent(this.get("model.constructor.modelName"));
  }),

  isValid: computed("model.isValid", {
    get() {
      return isBlank(this.get("model.isValid")) ? true : this.get("model.isValid");
    },

    set(key, value) {
      return value;
    }
  }),

  modelName: computed("model", function() {
    return this.get("model.constructor.modelName");
  }),

  translationKey: computed("model", function() {
    return camelize(this.get("model.constructor.modelName") || "");
  }),

  _setSuccessStatus: function() {
    this.set("status", "success");
  },

  _setFailureStatus: function() {
    this.set("isValid", false);
    this.set("status", "failure");
  }
});
