import Ember from "ember";

export default Ember.Controller.extend({
  title: Ember.computed(function() {
    return "test 123";
  }),

  programmers: Ember.A([
    { firstName: "Yehuda", id: 1 },
    { firstName: "Tom",    id: 2 }
  ]),

  currentProgrammer: null

  // programmers: ["Tom", "Yehuda"],
  // currentProgrammer: "Tom"
});
