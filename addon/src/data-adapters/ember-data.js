import Base from './base';
import classic from 'ember-classic-decorator';

@classic
export default class EmberData extends Base {
  get modelName() {
    return this.model?.constructor?.modelName;
  }

  isModel(object) {
    return object && !!object.constructor.modelName;
  }
}
