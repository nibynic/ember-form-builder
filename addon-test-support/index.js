export { default as fillForm } from './fill-form';
export { default as readForm } from './read-form';
export { default as readErrors } from './read-errors';
export { default as pick } from './pick';

import Registry from './accessors/registry';
export const registerAccessor = Registry.register;
