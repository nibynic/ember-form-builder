import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  model() {
    return (
      this.fixedModel || {
        attractions: [],
        guests: [],
        organizer: {},
        shoppingItems: [{}],
      }
    );
  }
}
