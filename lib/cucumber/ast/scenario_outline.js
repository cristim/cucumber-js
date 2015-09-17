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
      return newName;
    },

    applyMappingToSteps: function applyMappingToSteps (mapping) {
      return data.steps.map(function (stepData) {
        var newStepData = self.deepClone(stepData);

        self.iterateMapping(mapping, function (placeholder, value) {
          newStepData.text = newStepData.text.replace(placeholder, value);

          if (newStepData.stepArgument) {
            if (newStepData.stepArgument.type === 'DataTable') {
              newStepData.stepArgument.rows.forEach(function (row) {
                row.cells.forEach(function (cell) {
                  cell.value = cell.value.replace(placeholder, value);
                });
              });
            }
            else if (newStepData.stepArgument.type === 'DocString') {
              newStepData.stepArgument.content = newStepData.stepArgument.content.replace(placeholder, value);
            }
          }
        });

        return newStepData;
      });
    },

    deepClone: function deepClone(object) {
      var clone = _.clone(object);

      _.each(clone, function(value, key) {
        if (_.isObject(value)) {
          clone[key] = self.deepClone(value);
        }
      });

      return clone;
    },

    getScenarioDefinition: function getScenarioDefinition(example, location, mapping) {
      return {
        description: data.description,
        keyword: data.keyword,
        location: location,
        name: self.applyMappingToName(mapping),
        steps: self.applyMappingToSteps(mapping),
        tags: data.tags.concat(example.tags)
      };
    },

    getScenarioDefinitions: function getScenarioDefinitions() {
      var defs = [];
      data.examples.forEach(function(example){
        var placeholders = self.getTableRowValues(example.tableHeader);
        example.tableBody.forEach(function (tableRow) {
          var values = self.getTableRowValues(tableRow);
          var mapping = _.object(placeholders, values);
          var def = self.getScenarioDefinition(example, tableRow.location, mapping);
          defs.push(def);
        });
      });
      return defs;
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

  };
  return self;
}

module.exports = ScenarioOutline;
