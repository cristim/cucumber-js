function ScenarioOutline(data, uri, background) {
  var Cucumber = require('../../cucumber');
  var _ = require('underscore');
  _.mixin(require('underscore.deepclone'));

  var self = {

    applyMappingToName: function applyMappingToName (mapping) {
      var newName = data.name;
      self.iterateMapping(mapping, function(placeholder, value) {
        newName = newName.replace(placeholder, value);
      });
      return newName
    },

    applyMappingToSteps: function applyMappingToSteps (mapping) {
      return data.steps.map(function(stepData){
        var newStepData = _.deepClone(step);

        iterateMapping(example, function (placeholder, value) {
          newStepData.name = newStepData.replace(placeholder, value);

          if (newStepData.stepArgument.type === 'DataTable') {
            newStepData.stepArgument.rows.forEach(function (row) {
              row.cells.forEach(function (cell) {
                cell.value = cell.value.replace(placeholder, value);
              });
            });
          }
          else if (newStepData.stepArgument.type === 'DocString') {
            newStepData.stepArgument.content = newStepData.stepArgument.content.replace(placeholder, value);;
          }
        });
        return newStepData;
      });
    },

    buildScenario: function buildScenario(example, location, mapping) {
      var scenarioData = {
        description: data.description,
        keyword: data.keyword,
        location: location,
        name: self.applyMappingToName(mapping),
        steps: self.applyMappingToSteps(mapping),
        tags: data.tags.concat(example.tags),
      }
      return Cucumber.Ast.Scenario(scenarioData, uri, background);
    },

    buildScenarios: function buildScenarios() {
      var scenarios = Cucumber.Type.Collection();
      data.examples.forEach(function(example){
        var placeholders = getTableRowValues(example.tableHeader);
        example.tableBody.forEach(function (tableRow) {
          var values = getTableRowValues(example.tableRow);
          var mapping = _.object(placeholders, values);
          scenarios.add(buildScenario(example, tableRow.location, mapping));
        });
      })
      return scenarios;
    },

    getTableRowValues: function getTableRowValues(tableRow) {
      return tableRow.cells.map(function (cell) {
        return cell.value;
      });
    },

    iterateMapping: function iterateMapping(mapping, callback) {
      for (var placeholder in mapping) {
        if (mapping.hasOwnProperty(placeholder)) {
          var search = new RegExp('<' + placeholder + '>', 'g');
          var replacement = mapping[placeholder];
          callback(search, replacement);
        }
      }
    }

  }

  return self;
}

module.exports = ScenarioOutline;
