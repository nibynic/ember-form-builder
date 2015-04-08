import inputComponent from "ember-simple-form/helpers/input-component";
import inputOn from "ember-simple-form/helpers/input-on";

export var initialize = function(/* container, app */) {
  Ember.HTMLBars._registerHelper("input-component", inputComponent);
  Ember.HTMLBars._registerHelper("input-on", inputOn);
}

export default {
  name: "ember-simple-form-helpers",
  initialize: initialize
};
