import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { isBlank } from '@ember/utils';

export default class IndexController extends Controller {
  @alias('model.title') title;
  @alias('model.description') description;
  @alias('model.date') date;
  @alias('model.amazingMode') amazingMode;
  @alias('model.attractions') attractions;
  @alias('model.theme') theme;
  @alias('model.guests') guests;
  @alias('model.puppyPolicy') puppyPolicy;
  @alias('model.secret') secret;
  @alias('model.organizer') organizer;
  @alias('model.shoppingItems') shoppingItems;

  get validationsDummy() {
    return {
      title: {
        errors: isBlank(this.title) ? ['cannot be blank'] : [],
      },
    };
  }

  validate() {
    return this.validationsDummy.title.errors.length;
  }
}
