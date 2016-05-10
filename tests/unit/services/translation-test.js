import {moduleFor, test} from "ember-qunit";

moduleFor("service:translation", "Unit | Service | translation", {
  // Specify the other units that are required for this test.
  // needs: ["service:foo"]
});

// Replace this with your real tests.
test("it exists", function (assert) {
  let service = this.subject();
  assert.ok(service);
});

test("Defaults to ember-intl when both i18n and ember-intl are present", function() {
  let service = this.subject();
  let intl = "ember-intl";
  service.set("i18n", intl);
  assert.equal(service.get("translationService"), intl);
});

test("Throws warning when no active translation service available", function() {
  let service = this.subject();
  service.setProperties({
    intl: null,
    i18n: null
  });
  // TODO: assert using sinon: http://sinonjs.org/qunit/
  assert.ok(false);
});
