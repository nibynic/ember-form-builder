import { assert } from '@ember/debug';

export default function(path) {
  let parts = path.split('.');
  let inputName = parts[0] + parts.slice(1).map((v) => `[${v}]`).join('');
  let field = document.querySelector(`[data-test-input-name="${inputName}"]`);
  if (!field) {
    assert(`Input not found: ${path}`, false);
  }
  return field;
}
