import Base from './base';

export default class EmberOrbit extends Base {
  get modelName() {
    return this.model?.type;
  }

  isModel(object) {
    return (
      object &&
      object.constructor.attributes &&
      object.constructor.relationships
    );
  }
}
