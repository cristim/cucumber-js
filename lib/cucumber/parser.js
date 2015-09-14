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
        var featureData;

        try {
          featureData = parser.parse(source);
        } catch(e) {
          e.message += '\npath: ' + uri;
          throw e;
        }

        var feature = Cucumber.Ast.Feature(featureData, uri);
        features.add(feature);
      });

      return features;
    }
  };
  return self;
}

Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX = 0;
Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX = 1;

module.exports = Parser;
