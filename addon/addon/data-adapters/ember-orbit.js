import Base from './base';
import classic from 'ember-classic-decorator';

@classic
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
