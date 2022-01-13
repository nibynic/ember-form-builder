import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  readForm,
  fillForm,
  readErrors,
  pick,
} from 'ember-form-builder/test-support';

module('Acceptance | index', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.record = {
      title: 'Our party',
      description: 'Let’s celebrate something',
      date: new Date('1997-05-12'),
      amazingMode: true,
      attractions: ['grill', 'music', 'balloons'],
      theme: 'Star Wars',
      guests: ['Jan', 'Ann', 'Victor'],
      puppyPolicy: 'Without restrictions',
      secret: 'wellbeloud',
      organizer: {
        email: 'rick@example.com',
        phone: '123456789',
        homepage: 'bestpartiesever.com/rick',
      },
      shoppingItems: [
        { name: 'Balloons', amount: 213 },
        { name: 'Vegetables', amount: 1 },
      ],
    };
    this.owner.lookup('route:index').fixedModel = this.record;
    await visit('/');
  });

  test('it displays data', async function (assert) {
    let data = {
      title: 'Our party',
      description: 'Let’s celebrate something',
      date: new Date('1997-05-12'),
      amazingMode: true,
      attractions: ['grill', 'music', 'balloons'],
      theme: 'Star Wars',
      guests: ['Jan', 'Ann', 'Victor'],
      puppyPolicy: 'Without restrictions',
      secret: 'wellbeloud',
      organizer: {
        email: 'rick@example.com',
        phone: '123456789',
        homepage: 'bestpartiesever.com/rick',
      },
      shoppingItems: [
        { name: 'Balloons', amount: 213 },
        { name: 'Vegetables', amount: 1 },
      ],
    };

    assert.deepEqual(readForm('party', data), data);
  });

  test('it validates data', async function (assert) {
    await fillForm('party', {
      title: '',
    });

    let errors = {
      title: 'cannot be blank',
    };

    assert.deepEqual(readErrors('party', errors), errors);
  });

  test('it updates data', async function (assert) {
    let newData = {
      title: 'Our best ever party',
      description: 'Celebrating best ever things',
      date: new Date('2200-05-12'),
      amazingMode: false,
      attractions: ['music', 'fireworks'],
      theme: 'Lagaan',
      guests: ['Patricia', 'Amelie'],
      puppyPolicy: 'Supervised only',
      secret: 'donotread',
      organizer: {
        email: 'sam@example.com',
        phone: '987654321',
        homepage: 'bestpartiesever.com/sam',
      },
      shoppingItems: [
        { name: 'Fireworks', amount: 1 },
        { name: 'Vegetables', amount: 100 },
      ],
    };
    await fillForm('party', newData);
    await click('button[type=submit]');

    assert.deepEqual(pick(this.record, newData), newData);
  });
});
