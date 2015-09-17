function Parser(featureSources, astFilter) {
  var Gherkin  = require('gherkin');
  var Cucumber = require('../cucumber');

  var parser   = new Gherkin.Parser();

  var self = {
    parse: function parse() {
      var features = Cucumber.Type.Collection();

      featureSources.forEach(function (featureSource) {
        var uri    = featureSource[Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX];
        var source = featureSource[Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX].toString();
        var data;

        try {
          data = parser.parse(source);
        } catch(e) {
          e.message += '\npath: ' + uri;
          throw e;
        }

        var feature = self.buildFeature(data, uri);
        features.add(feature);
      });

      return features;
    },

    buildFeature: function buildFeature(data, uri) {
      var background = self.buildBackground(data.background, uri)
      var scenarios = self.buildScenarios(data.scenarioDefinitions, uri);
      var tags = self.buildTags(data.tags, uri)

      scenarios.syncForEach(function (scenario) {
        scenario.setBackground(data.background);
        scenario.setInheritedTags(tags);
      })

      var properties = {
        background: background,
        description: data.description,
        keyword: data.keyword,
        line: self.parseLine(data),
        name: data.name,
        scenarios: scenarios,
        tags: tags,
        uri: uri
      };

      return Cucumber.Ast.Feature(properties);
    }

    buildScenarios: function buildScenarios(definitions, uri) {
      var scenarios = Cucumber.Type.Collection();
      definitions.forEach(function (scenarioDefinition) {

      });
    }

    buildTags: function buildTags (data, uri) {
      var tags = []
      data.each(function ())
      var properties =
    }

    parseLine: function (data) {
      return data.location.line;
    }
  };
  return self;
}

Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX = 0;
Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX = 1;

module.exports = Parser;
