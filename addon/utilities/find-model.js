import Ember from "ember";

// TODO refactor to remove the ugly duplication

export default function findObject(object) {
  if (Ember.get(object, "content.constructor.modelName")) {
    return Ember.get(object, "content");
  }

  if (Ember.get(object, "model.constructor.modelName")) {
    return Ember.get(object, "model");
  }

  var nestedObject, potentialModel;

  nestedObject = Ember.get(object, "content");
  if (!Ember.isEmpty(nestedObject)) {
    potentialModel = findObject(nestedObject);
    if (potentialModel !== nestedObject) {
      return potentialModel;
    }
  }

  nestedObject = Ember.get(object, "model");
  if (!Ember.isEmpty(nestedObject)) {
    potentialModel = findObject(nestedObject);
    if (potentialModel !== nestedObject) {
      return potentialModel;
    }
  }

  return object;
}
