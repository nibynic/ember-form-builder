import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.fixedModel || {
      attractions: [],
      guests: [],
      organizer: {},
      shoppingItems: [{}]
    };
  }
})
