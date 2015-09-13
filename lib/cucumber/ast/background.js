function Background(data, uri) {
  var Cucumber = require('../../cucumber');

  var steps = Cucumber.Type.Collection();

  var previousStep;
  data.steps.forEach(function (stepData) {
    step = Cucumber.Ast.Step(stepData, uri, previousStep)
    steps.add(step);
    previousStep = step;
  });

  var self = {
    getKeyword: function getKeyword() {
      return data.keyword;
    },

    getName: function getName() {
      return data.name;
    },

    getDescription: function getDescription() {
      return data.description;
    },

    getUri: function getUri() {
      return uri;
    },

    getLine: function getLine() {
      return data.location.line;
    },

    getLastStep: function getLastStep() {
      return steps.getLast();
    },

 	  getSteps: function getSteps() {
      return steps;
 	  }
  };
  return self;
}

module.exports = Background;
