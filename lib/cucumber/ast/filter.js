var _ = require('underscore');

function Filter(rules) {
  var self = {
    isElementEnrolled: function isElementEnrolled(element) {
      var enrolled = _.all(rules, function (rule) {
        return rule.isSatisfiedByElement(element);
      });
      return enrolled;
    }
  };
  return self;
}

Filter.AnyOfTagsRule          = require('./filter/any_of_tags_rule');
Filter.ElementMatchingTagSpec = require('./filter/element_matching_tag_spec');
Filter.ModularPartitioning    = require('./filter/modular_partitioning');
Filter.ScenarioAtLineRule     = require('./filter/only_run_scenario_at_line_rule');

module.exports = Filter;
