import Base from './base';

export default class EmberData extends Base {
  get modelName() {
    return this.model?.constructor?.modelName;
  }

  isModel(object) {
    return object && !!object.constructor.modelName;
  }
}
