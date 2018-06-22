import Mixin from '@ember/object/mixin';

export default Mixin.create({
  errorsPathFor(attribute) {
    return `object.validations.attrs.${attribute}.messages`;
  }
});
