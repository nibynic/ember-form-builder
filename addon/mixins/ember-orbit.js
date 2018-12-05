import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  modelName: reads('model.type'),

  isModel(object) {
    return object && object.constructor.attributes && object.constructor.relationships;
  }
});
