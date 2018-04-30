import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';

// TODO refactor to remove the ugly duplication

export default function findObject(object) {
  if (get(object, "content.constructor.modelName")) {
    return get(object, "content");
  }

  if (get(object, "model.constructor.modelName")) {
    return get(object, "model");
  }

  var nestedObject, potentialModel;

  nestedObject = get(object, "content");
  if (!isEmpty(nestedObject)) {
    potentialModel = findObject(nestedObject);
    if (potentialModel !== nestedObject) {
      return potentialModel;
    }
  }

  nestedObject = get(object, "model");
  if (!isEmpty(nestedObject)) {
    potentialModel = findObject(nestedObject);
    if (potentialModel !== nestedObject) {
      return potentialModel;
    }
  }

  return object;
}
