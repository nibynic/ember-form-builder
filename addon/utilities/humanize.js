export default function(string) {
  return string.underscore().split("_").join(" ").capitalize();
}
