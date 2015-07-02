import inputComponent from "ember-simple-form/keywords/input-component";
import inputOn from "ember-simple-form/keywords/input-on";
import submitOn from "ember-simple-form/keywords/submit-on";

var registerKeyword = Ember.__loader.require("ember-htmlbars/keywords").registerKeyword;

export var initialize = function(/* container, app */) {
  registerKeyword("input-component", inputComponent);
  registerKeyword("input-on", inputOn);
  registerKeyword("submit-on", submitOn);
}

export default {
  name: "ember-simple-form-keywords",
  initialize: initialize
};
