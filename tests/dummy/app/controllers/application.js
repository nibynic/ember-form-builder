import Ember from "ember";

export default Ember.Controller.extend({
  title: function() {
    return "test 123";
  }.property(),

  // programmers: [
  //   { firstName: "Yehuda", id: 1 },
  //   { firstName: "Tom",    id: 2 }
  // ],
  //
  // currentProgrammer: 2,

  programmers: ["Tom", "Yehuda"],
  currentProgrammer: "Tom",

  additionalProgrammerSelectAttributeNames: [
    "collection", "optionLabelPath", "optionValuePath"
  ]

});
