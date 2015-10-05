import Ember from "ember";
import findModel from "ember-simple-form/utilities/find-model";

export default Ember.Object.extend({
  status: null,
  isLoading: Ember.computed.alias("model.isSaving"),
  children: Ember.computed(function() {
    return Ember.A([]);
  }),

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
      validations.push(Ember.RSVP.resolve(true));
    }

    this.get("children").forEach((child) => {
      validations.push(child.validate());
    });

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.RSVP.Promise.all(validations).then(
        () => { this.set("isValid", true); resolve(); },
        () => { this.set("isValid", false); reject(); }
      );
    });
  },

  model: Ember.computed("object", function() {
    return findModel(this.get("object"));
  }),

  isValid: Ember.computed("model.isValid", {
    get() {
      return Ember.isBlank(this.get("model.isValid")) ? true : this.get("model.isValid");
    },

    set(key, value) {
      return value;
    }
  }),

  modelName: Ember.computed("model", function() {
    return this.get("model.constructor.modelName");
  }),

  translationKey: Ember.computed("model", function() {
    return Ember.String.camelize(this.get("model.constructor.modelName") || "");
  }),

  _setSuccessStatus: function() {
    this.set("status", "success");
  },

  _setFailureStatus: function() {
    this.set("isValid", false);
    this.set("status", "failure");
  }
});
