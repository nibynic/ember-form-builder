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

test("Defaults to ember-i18n when both i18n and ember-intl are present", function(assert) {
  let service = this.subject();
  let intl = "ember-intl";
  let i18n = "i18n";
  service.setProperties({
    i18n: i18n,
    intl: intl
  });
  assert.equal(service.get("translationService"), i18n);
});
