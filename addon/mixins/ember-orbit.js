import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  modelName: reads('model.constructor.typeKey'),

  isModel(object) {
    return object && object.constructor.hasOwnProperty('typeKey');
  }
});
