function Step(data) {
  var Cucumber = require('../../cucumber');
  var attachment, previousStep;

  var self = {
    setPreviousStep: function setPreviousStep(newPreviousStep) {
      previousStep = newPreviousStep;
    },

    isHidden: function isHidden() {
      return false;
    },

    isOutlineStep: function isOutlineStep() {
      return false;
    },

    getKeyword: function getKeyword() {
      return data.keyword;
    },

    getName: function getName() {
      return data.name;
    },

    hasUri: function hasUri() {
      return true;
    },

    getUri: function getUri() {
      return data.uri;
    },

    getLine: function getLine() {
      return data.line;
    },

    getPreviousStep: function getPreviousStep() {
      return previousStep;
    },

    hasPreviousStep: function hasPreviousStep() {
      return !!previousStep;
    },

    getAttachment: function getAttachment() {
      return data.attachment;
    },

    hasAttachment: function hasAttachment() {
      return !!attachment
    },

    isOutcomeStep: function isOutcomeStep() {
      return self.hasOutcomeStepKeyword() || self.isRepeatingOutcomeStep();
    },

    isEventStep: function isEventStep() {
      return self.hasEventStepKeyword() || self.isRepeatingEventStep();
    },

    hasOutcomeStepKeyword: function hasOutcomeStepKeyword() {
      return keyword === Step.OUTCOME_STEP_KEYWORD;
    },

    hasEventStepKeyword: function hasEventStepKeyword() {
      return keyword === Step.EVENT_STEP_KEYWORD;
    },

    isRepeatingOutcomeStep: function isRepeatingOutcomeStep() {
      return self.hasRepeatStepKeyword() && self.isPrecededByOutcomeStep();
    },

    isRepeatingEventStep: function isRepeatingEventStep() {
      return self.hasRepeatStepKeyword() && self.isPrecededByEventStep();
    },

    hasRepeatStepKeyword: function hasRepeatStepKeyword() {
      return keyword === Step.AND_STEP_KEYWORD || keyword === Step.BUT_STEP_KEYWORD || keyword === Step.STAR_STEP_KEYWORD;
    },

    isPrecededByOutcomeStep: function isPrecededByOutcomeStep() {
      var result = false;

      if (self.hasPreviousStep()) {
        var previousStep = self.getPreviousStep();
        result           = previousStep.isOutcomeStep();
      }
      return result;
    },

    isPrecededByEventStep: function isPrecededByEventStep() {
      var result = false;

      if (self.hasPreviousStep()) {
        var previousStep          = self.getPreviousStep();
        result = previousStep.isEventStep();
      }
      return result;
    },

    acceptVisitor: function acceptVisitor(visitor, callback) {
      self.execute(visitor, function (stepResult) {
        visitor.visitStepResult(stepResult, callback);
      });
    },

    getStepDefinition: function getStepDefinition(visitor) {
      return visitor.lookupStepDefinitionByName(name);
    },

    execute: function execute(visitor, callback) {
      var stepDefinition = self.getStepDefinition(visitor);
      var world          = visitor.getWorld();
      var scenario       = visitor.getScenario();
      var domain         = visitor.getDomain();
      stepDefinition.invoke(self, world, scenario, domain, callback);
    }
  };
  return self;
}

Step.EVENT_STEP_KEYWORD   = 'When ';
Step.OUTCOME_STEP_KEYWORD = 'Then ';
Step.AND_STEP_KEYWORD     = 'And ';
Step.BUT_STEP_KEYWORD     = 'But ';
Step.STAR_STEP_KEYWORD    = '* ';

module.exports = Step;
