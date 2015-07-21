import Ember from "ember";
import findModel from "ember-simple-form/utilities/find-model";

export default Ember.Object.extend({
  status: null,
  isValid: true,
  isLoading: Ember.computed.alias("model.isSaving"),

  init: function() {
    if (this.get("model").on) {
      this.get("model").on("didCreate", this, this._setSuccessStatus);
      this.get("model").on("didUpdate", this, this._setSuccessStatus);
      this.get("model").on("becameInvalid", this, this._setFailureStatus);
    }
  },

  willDestroy: function() {
    if (this.get("model").off) {
      this.get("model").off("didCreate", this, this._setSuccessStatus);
      this.get("model").off("didUpdate", this, this._setSuccessStatus);
      this.get("model").off("becameInvalid", this, this._setFailureStatus);
    }
  },

  model: Ember.computed("object", function() {
    return findModel(this.get("object"));
  }),

  modelName: Ember.computed("model", function() {
    return this.get("model.constructor.modelName");
  }),

  translationKey: Ember.computed("model", function() {
    return this.get("model.constructor.modelName");
  }),

  _setSuccessStatus: function() {
    this.set("status", "success");
  },

  _setFailureStatus: function() {
    this.set("isValid", false);
    this.set("status", "failure");
  }
});
