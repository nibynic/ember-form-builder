import OriginalRegistry from 'ember-form-builder/services/form-builder-registry';
import { importSync } from '@embroider/macros';
import { ensureSafeComponent } from '@embroider/util';

// This service eagerly loads all FormBuilder inputs and input wrappers
// If you need more control over what gets imported, delete this file
// and use register-form-builder-input helper
// or FormBuilderRegistryService.registerInput() instead

export default class FormBuilderRegistryService extends OriginalRegistry {
  resolveInput(type) {
    return ensureSafeComponent(
      importSync(`../components/inputs/${type}-input.js`).default,
      this
    );
  }

  resolveWrapper(type) {
    return ensureSafeComponent(
      importSync(`../components/input-wrappers/${type}.js`).default,
      this
    );
  }
}
