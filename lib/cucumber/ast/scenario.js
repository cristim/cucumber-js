function Scenario(data, uri, background, inheritedTags) {
  var Cucumber = require('../../cucumber');

  var steps = Cucumber.Type.Collection();
  var tags = [];

  data.steps.forEach(function (step) {
    steps.add(Cucumber.Ast.Step(step, uri));
  });

  data.tags.forEach(function (tag) {
    tags.add(Cucumber.Ast.Tag(tag, uri));
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

    getBackground: function getBackground() {
      return background;
    },

    getLastStep: function getLastStep() {
      return steps.getLast();
    },

    getSteps: function getSteps() {
      return steps;
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
        var steps = background.getSteps();
        self.instructVisitorToVisitSteps(visitor, steps, callback);
      } else {
        callback();
      }
    },

    instructVisitorToVisitScenarioSteps: function instructVisitorToVisitScenarioSteps(visitor, callback) {
      self.instructVisitorToVisitSteps(visitor, steps, callback);
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
