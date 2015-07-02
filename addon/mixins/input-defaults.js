import Ember from "ember";

export default Ember.Mixin.create({

  value: Ember.computed.alias("modelValue"),

  setElementId: Ember.on("init", function() {
    if(this.get("inputElementId")) {
      this.set("elementId", this.get("inputElementId"));
    }
  })

});
