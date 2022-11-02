import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class RegisterFormBuilderInputHelper extends Helper {
  @service formBuilderRegistry;

  compute([type, component]) {
    this.formBuilderRegistry.registerInput(type, component);
  }
}
