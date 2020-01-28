import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isBlank } from '@ember/utils';

export default Controller.extend({
  title:          alias('model.title'),
  description:    alias('model.description'),
  date:           alias('model.date'),
  amazingMode:    alias('model.amazingMode'),
  attractions:    alias('model.attractions'),
  theme:          alias('model.theme'),
  guests:         alias('model.guests'),
  puppyPolicy:    alias('model.puppyPolicy'),
  secret:         alias('model.secret'),
  organizer:      alias('model.organizer'),
  shoppingItems:  alias('model.shoppingItems'),

  validationsDummy: computed('title', function() {
    return {
      title: {
        errors: isBlank(this.title) ? ['cannot be blank'] : []
      }
    }
  }),

  validate() {
    return this.validationsDummy.title.errors.length;
  }
});
