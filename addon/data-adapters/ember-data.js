import { reads } from '@ember/object/computed';
import Base from './base';

export default class EmberData extends Base {
  @reads('model.constructor.modelName')
  modelName;

  isModel(object) {
    return object && object.constructor.hasOwnProperty('modelName');
  }
}
