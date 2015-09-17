function HookStep(keyword) {
  var Cucumber = require('../../cucumber');
  var self = Cucumber.Ast.Step({keyword: keyword});

  self.isHidden = function isHidden() {
    return true;
  };

  self.getLine = function getLine() {
    return undefined;
  }

  self.hasUri = function hasUri() {
    return false;
  };

  self.setHook = function setHook(newHook) {
    hook = newHook;
  };

  self.getStepDefinition = function getStepDefinition() {
    return hook;
  };

  return self;
}

HookStep.NAME           = undefined;
HookStep.UNDEFINED_URI  = undefined;
HookStep.UNDEFINED_LINE = undefined;

module.exports = HookStep;
