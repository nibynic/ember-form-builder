import SimpleInput from "./simple-input";

let InputOn = SimpleInput.extend({
  layoutName: "components/simple-input"
});

InputOn.reopenClass({
  positionalParams: ["attr"]
});

export default InputOn;
