import { A } from '@ember/array';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { Promise } from 'rsvp';

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
  currentProgrammers: A(),

  deferredProgrammers: computed(function() {
    let programmers = A([
      { firstName: "Yollanda", id: 3 },
      { firstName: "Becky",    id: 4 }
    ]);
    return new Promise(function(resolve) {
      setTimeout(() => {
        resolve(programmers);
      }, 100);
    });
  }),

  currentDeferredProgrammerId: 4

  // programmers: ["Tom", "Yehuda"],
  // currentProgrammer: "Tom"
});
