/* jshint -W106 */
function JsonFormatter(options) {
  var Cucumber = require('../../cucumber');

  var features = []
  var self     = Cucumber.Listener.Formatter(options);

  var currentFeature, currentElement, currentStep, parentFeatureTags;

  self.addFeature = function(feature) {
    features.push(feature);
    currentFeature = feature;
  }

  self.addElement = function (element) {
    if (!currentFeature.elements) {
      currentFeature.elements = [];
    }
    currentFeature.elements.push(element);
    currentElement = element;
  };

  self.addStep = function(step) {
    if (!currentElement.steps) {
      currentElement.steps = [];
    }
    currentElement.steps.push(step);
    currentStep = step;
  }

  self.addEmbeddings = function(embedding) {
    if (!currentStep.embeddings) {
      currentStep.embeddings = [];
    }
    currentStep.embeddings.push(embedding);
  }

  self.createId = function(name) {
    return name.toLowerCase().replace(/ /g, '-');
  }

  self.formatStep = function formatStep(step) {
    var stepProperties = {
      name:    step.getName(),
      line:    step.getLine(),
      keyword: step.getKeyword()
    };
    if (step.isHidden()) {
      stepProperties.hidden = true;
    }
    if (step.hasDocString()) {
      var docString = step.getDocString();
      stepProperties.doc_string = {
        value:        docString.getContents(),
        line:         docString.getLine(),
        content_type: docString.getContentType()
      };
    }
    if (step.hasDataTable()) {
      var tableContents   = step.getDataTable().getContents();
      var raw             = tableContents.raw();
      var tableProperties = [];
      raw.forEach(function (rawRow) {
        var row = {line: undefined, cells: rawRow};
        tableProperties.push(row);
      });
      stepProperties.rows = tableProperties;
    }
    self.addStep(stepProperties);
  };

  self.formatTags = function formatTags(tags, parentTags) {
    var tagsProperties = [];
    tags.forEach(function (tag) {
      var isParentTag = false;
      if (parentTags) {
        parentTags.forEach(function (parentTag) {
          if ((tag.getName() === parentTag.getName()) && (tag.getLine() === parentTag.getLine())) {
            isParentTag = true;
          }
        });
      }
      if (!isParentTag) {
        tagsProperties.push({name: tag.getName(), line: tag.getLine()});
      }
    });
    return tagsProperties;
  };

  self.handleBeforeFeatureEvent = function handleBeforeFeatureEvent(event, callback) {
    var feature      = event.getPayloadItem('feature');
    var featureProperties = {
      id:          self.createId(feature.getName()),
      name:        feature.getName(),
      description: feature.getDescription(),
      line:        feature.getLine(),
      keyword:     feature.getKeyword(),
      uri:         feature.getUri()
    };

    var tags = parentFeatureTags = feature.getTags();
    if (tags.length > 0) {
      featureProperties.tags = self.formatTags(tags, []);
    }

    self.addFeature(featureProperties);
    callback();
  };

  self.handleBackgroundEvent = function handleBackgroundEvent(event, callback) {
    var background = event.getPayloadItem('background');
    var backgroundProperties = {
      name:        background.getName(),
      keyword:     'Background',
      description: background.getDescription() || '',
      type:        'background',
      line:        background.getLine()
    };
    self.addElement(backgroundProperties);
    var steps = background.getSteps();
    steps.forEach(function (value) { self.formatStep(value); });
    callback();
  };

  self.handleBeforeScenarioEvent = function handleBeforeScenarioEvent(event, callback) {
    var scenario = event.getPayloadItem('scenario');
    var id = currentFeature.id + ';' + self.createId(scenario.getName());
    var scenarioProperties = {
      name: scenario.getName(),
      id: id,
      line: scenario.getLine(),
      keyword: 'Scenario',
      description: scenario.getDescription() || '',
      type: 'scenario'
    };

    var tags = scenario.getTags();
    if (tags.length > 0) {
      var formattedTags = self.formatTags(tags, parentFeatureTags);
      if (formattedTags.length > 0) {
        scenarioProperties.tags = formattedTags;
      }
    }
    self.addElement(scenarioProperties);
    callback();
  };

  self.handleStepResultEvent = function handleStepResultEvent(event, callback) {
    var stepResult = event.getPayloadItem('stepResult');

    var step = stepResult.getStep();
    self.formatStep(step);

    var stepOutput = {};
    var resultStatus;
    var attachments;

    if (stepResult.isSuccessful()) {
      resultStatus = 'passed';
      if (stepResult.hasAttachments()) {
        attachments = stepResult.getAttachments();
      }
      stepOutput.duration = stepResult.getDuration();
    }
    else if (stepResult.isPending()) {
      resultStatus = 'pending';
      stepOutput.error_message = undefined;
    }
    else if (stepResult.isSkipped()) {
      resultStatus = 'skipped';
    }
    else if (stepResult.isUndefined()) {
      resultStatus = 'undefined';
    }
    else {
      resultStatus = 'failed';
      var failureMessage = stepResult.getFailureException();
      if (failureMessage) {
        stepOutput.error_message = (failureMessage.stack || failureMessage);
      }
      if (stepResult.hasAttachments()) {
        attachments = stepResult.getAttachments();
      }
      stepOutput.duration = stepResult.getDuration();
    }

    stepOutput.status = resultStatus;
    currentStep.result = stepOutput;
    currentStep.match = {location: undefined};
    if (attachments) {
      attachments.syncForEach(function (attachment) {
        self.addEmbedding(attachment.getMimeType(), attachment.getData());
      });
    }
    callback();
  };

  self.handleAfterFeaturesEvent = function handleAfterFeaturesEvent(event, callback) {
    self.log(JSON.stringify(features, null, 2));
    callback();
  };

  return self;
}

module.exports = JsonFormatter;
