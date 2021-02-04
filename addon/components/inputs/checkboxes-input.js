import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CheckboxesInput extends Component {
  @action
  registerWrapper(el) {
    this.wrapper = el;
  }

  @action
  getSelectedIndices() {
    var indices = [];
    this.wrapper.querySelectorAll('input').forEach(function(input, i) {
      if(input.checked) {
        indices.push(i);
      }
    });
    return indices;
  }
}
