import { get } from '@ember/object';

function typeForProperty(object, property) {
  try {
    return object.constructor.metaForProperty &&
      object.constructor.metaForProperty(property) &&
      object.constructor.metaForProperty(property).type;
  } catch(error) {
    return null;
  }
}

export default function(object, attribute, input) {
  if (attribute.match(/password/i)) {
    return "password";
  }

  if (attribute.match(/email/)) {
    return "email";
  }

  if (attribute.match(/^(is|has|did)/)) {
    return "boolean";
  }

  if (get(input, "collection")) {
    return "collection";
  }

  var type = typeForProperty(object, attribute);
  if (type) { return type; }

  return "string";
}
