export default function (attrs) {
  let result = {};
  Object.entries(attrs).forEach(([path, value]) => {
    let context = result;
    let prevKey;
    path.split('.').forEach((key) => {
      if (prevKey) {
        if (!isNaN(key * 1)) {
          context[prevKey] = context[prevKey] || [];
        } else {
          context[prevKey] = context[prevKey] || {};
        }
        context = context[prevKey];
      }
      prevKey = key;
    });
    context[prevKey] = value;
  });
  return result;
}
