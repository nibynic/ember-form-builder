import { defineProperty } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  value: alias("modelValue"),
  name: alias("inputName"),

  setElementId: on("init", function() {
    if(this.get("inputElementId")) {
      this.set("elementId", this.get("inputElementId"));
    }
  }),

  proxyAdditionalAttributes: on("init", function() {
    for(let key in this.get("additionalAttributes")) {
      if (this.get("additionalAttributes").hasOwnProperty(key)) {
        defineProperty(this, key, alias(`additionalAttributes.${key}`));
      }
    }
  })

});
