function Feature(data, uri) {
  var Cucumber = require('../../cucumber');

  var background;
  var scenarios = Cucumber.Type.Collection();
  var tags = [];

  if (data.background){
    background = Cucumber.Ast.Background(data.background, uri);
  }

  data.tags.forEach(function (tagData) {
    var tag = Cucumber.Ast.Tag(tagData, uri);
    tags.push(tag)
  });

  data.scenarioDefinitions.forEach(function (scenarioDefinition) {
    var defs = [];

    if (scenarioDefinition.type === 'Scenario') {
      defs.push(scenarioDefinition)
    } else if (scenarioDefinition.type === 'ScenarioOutline') {
      var scenarioOutline = Cucumber.Ast.ScenarioOutline(scenarioDefinition, uri);
      defs = defs.concat(scenarioOutline.getScenarioDefinitions())
    }

    defs.forEach(function (def) {
      var scenario = Cucumber.Ast.Scenario(scenarioDefinition, uri);
      scenario.setBackground(background);
      scenario.addInheritedTags(tags);
      scenarios.add(scenario);
    })
  });

  var self = {
    getKeyword: function getKeyword() {
      return data.keyword;
    },

    getName: function getName() {
      return data.name;
    },

    getDescription: function getDescription() {
      return data.description || '';
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

    hasBackground: function hasBackground() {
      return (typeof(background) !== 'undefined');
    },

    getTags: function getTags() {
      return tags;
    },

    acceptVisitor: function acceptVisitor(visitor, callback) {
      self.instructVisitorToVisitBackground(visitor, function () {
        self.instructVisitorToVisitScenarios(visitor, callback);
      });
    },

    instructVisitorToVisitBackground: function instructVisitorToVisitBackground(visitor, callback) {
      if (self.hasBackground()) {
        var background = self.getBackground();
        visitor.visitBackground(background, callback);
      } else {
        callback();
      }
    },

    instructVisitorToVisitScenarios: function instructVisitorToVisitScenarios(visitor, callback) {
      scenarios.forEach(function (scenario, iterate) {
        visitor.visitScenario(scenario, iterate);
      }, callback);
    }
  };
  return self;
}

module.exports = Feature;
