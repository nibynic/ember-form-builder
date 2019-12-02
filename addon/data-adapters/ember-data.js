import Base from './base';
import { reads } from '@ember/object/computed';

export default Base.extend({
  modelName: reads('model.constructor.modelName'),

  isModel(object) {
    return object && object.constructor.hasOwnProperty('modelName');
  }
});
