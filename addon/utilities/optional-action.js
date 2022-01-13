export default function (target, key, descriptor) {
  descriptor.value = function () {
    return (this.args[key] || function () {})(...arguments);
  };
  return descriptor;
}
