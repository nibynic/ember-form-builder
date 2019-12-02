import Base from './base';
import { reads } from '@ember/object/computed';

export default Base.extend({
  modelName: reads('model.type'),

  isModel(object) {
    return object && object.constructor.attributes && object.constructor.relationships;
  }
});
