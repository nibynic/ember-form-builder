import Service from '@ember/service';
import { assert } from '@ember/debug';
import { ensureSafeComponent } from '@embroider/util';

export default class FormBuilderRegistryService extends Service {
  INPUTS = {};

  registerInput(type, component) {
    this.INPUTS[type] = ensureSafeComponent(component, this);
  }

  resolveInput(type) {
    let input = this.INPUTS[type];
    assert(
      `FormBuilder input for type ${type} not found. Make sure to register your inputs with register-form-builder-input helper or via FormBuilderRegistryService.registerInput()`,
      input
    );
    return input;
  }

  WRAPPERS = {};

  registerWrapper(type, component) {
    this.WRAPPERS[type] = ensureSafeComponent(component, this);
  }

  resolveWrapper(type) {
    let wrapper = this.WRAPPERS[type];
    assert(
      `FormBuilder wrapper ${type} not found. Make sure to register your wrappers with register-form-builder-wrapper helper or via FormBuilderRegistryService.registerWrapper()`,
      wrapper
    );
    return wrapper;
  }
}
