import SimpleInput from "./simple-input";

const InputOn = SimpleInput.extend({
  layoutName: "components/simple-input"
});

InputOn.reopenClass({
  positionalParams: ["attr"]
});

export default InputOn;
