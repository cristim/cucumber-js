function Scenario(data, uri) {
  var Cucumber = require('../../cucumber');

  var background;
  var inheritedTags = [];
  var steps = Cucumber.Type.Collection();
  var tags = [];

  var previousStep;
  data.steps.forEach(function (stepData) {
    var step = Cucumber.Ast.Step(stepData, uri);
    step.setPreviousStep(previousStep);
    steps.add(step);
    previousStep = step;
  });

  data.tags.forEach(function (tagData) {
    var tag = Cucumber.Ast.Tag(tagData, uri)
    tags.push(tag);
  });

  var self = {
    setBackground: function setBackground(newBackground) {
      background = newBackground;
    },

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

    getBackground: function getBackground() {
      return background;
    },

    getSteps: function getSteps() {
      return steps;
    },

    addInheritedTags: function addInheritedTags(newTags) {
      inheritedTags = tags.concat(newTags);
    },

    getTags: function getTags() {
      return tags.concat(inheritedTags);
    },

    getOwnTags: function getOwnTags() {
      return tags;
    },

    acceptVisitor: function acceptVisitor(visitor, callback) {
      self.instructVisitorToVisitBackgroundSteps(visitor, function () {
        self.instructVisitorToVisitScenarioSteps(visitor, callback);
      });
    },

    instructVisitorToVisitBackgroundSteps: function instructVisitorToVisitBackgroundSteps(visitor, callback) {
      var background = self.getBackground();
      if (typeof(background) !== 'undefined') {
        self.instructVisitorToVisitSteps(visitor, background.getSteps(), callback);
      } else {
        callback();
      }
    },

    instructVisitorToVisitScenarioSteps: function instructVisitorToVisitScenarioSteps(visitor, callback) {
      self.instructVisitorToVisitSteps(visitor, self.getSteps(), callback);
    },

    instructVisitorToVisitSteps: function instructVisitorToVisitSteps(visitor, steps, callback) {
      steps.forEach(function (step, iterate) {
        visitor.visitStep(step, iterate);
      }, callback);
    }
  };
  return self;
}

module.exports = Scenario;
