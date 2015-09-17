function OutlineStep(data) {
  var Cucumber = require('../../cucumber');
  var self = Cucumber.Ast.Step(data);

  self.getOutlineName = function getOutlineName() {
    return data.outlineText;
  };

  self.isOutlineStep = function isOutlineStep() {
    return true;
  };

  return self;
}

module.exports = OutlineStep;
