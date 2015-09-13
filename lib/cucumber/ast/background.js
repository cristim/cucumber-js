function Background(data, uri) {
  var Cucumber = require('../../cucumber');

  var steps = Cucumber.Type.Collection();
  var len = data.steps.length;
  for (var i = 0; i < len; i++) {
    steps.add(Cucumber.Ast.Step(data.steps[i], uri));
  }

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
      return data.localtion.line;
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
