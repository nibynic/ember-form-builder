import inputComponent from "ember-simple-form/helpers/input-component";

export var initialize = function(/* container, app */) {
  Ember.HTMLBars._registerHelper("input-component", inputComponent);
}

export default {
  name: "ember-simple-form-helpers",
  initialize: initialize
};
