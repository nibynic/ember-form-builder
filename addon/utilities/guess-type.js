function typeForProperty(object, property) {
  try {
    return object.constructor.metaForProperty &&
      object.constructor.metaForProperty(property) &&
      object.constructor.metaForProperty(property).type;
  } catch(error) {
    return null;
  }
}

export default function(model, { attr, collection }) {
  attr = attr || '';
  if (attr.match(/password/i)) {
    return "password";
  }

  if (attr.match(/email/)) {
    return "email";
  }

  if (attr.match(/^(is|has|did)/)) {
    return "boolean";
  }

  if (collection) {
    return "collection";
  }

  var type = typeForProperty(model, attr);
  if (type) { return type; }

  return "string";
}
