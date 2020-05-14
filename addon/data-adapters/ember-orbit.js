import { reads } from '@ember/object/computed';
import Base from './base';

export default class EmberOrbit extends Base {
  @reads('model.type')
  modelName;

  isModel(object) {
    return object && object.constructor.attributes && object.constructor.relationships;
  }
}
