import Ember from "ember";

export default function(string) {
  return Ember.String.capitalize(Ember.String.underscore(string).split("_").join(" "));
}
