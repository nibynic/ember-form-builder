import { A } from '@ember/array';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  title: computed(function() {
    return "test 123";
  }),

  programmers: A([
    { firstName: "Yehuda", id: 1 },
    { firstName: "Tom",    id: 2 }
  ]),

  currentProgrammerId: 2,
  currentProgrammer: null,
  currentProgrammers: A()

  // programmers: ["Tom", "Yehuda"],
  // currentProgrammer: "Tom"
});
