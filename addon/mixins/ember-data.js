import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  modelName: reads('model.constructor.modelName'),

  isModel(object) {
    return object && object.constructor.hasOwnProperty('modelName');
  },

  init: function() {
    this._super(...arguments);
    let model = this.get('model')
    if (model && model.on) {
      this.get('model').on('didCreate', this, this._setSuccessStatus);
      this.get('model').on('didUpdate', this, this._setSuccessStatus);
      this.get('model').on('becameInvalid', this, this._setFailureStatus);
    }
  },

  willDestroy: function() {
    let model = this.get('model');
    if (model && model.off) {
      this.get('model').off('didCreate', this, this._setSuccessStatus);
      this.get('model').off('didUpdate', this, this._setSuccessStatus);
      this.get('model').off('becameInvalid', this, this._setFailureStatus);
    }
    this._super(...arguments);
  },
});
