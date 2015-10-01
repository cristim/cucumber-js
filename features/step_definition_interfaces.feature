Feature: Step Definition Interfaces

  Background:
    Given a file named "features/fail.feature" with:
      """
      Feature: a feature
        Scenario: a scenario
          Given a step
      """

  Scenario: synchronous
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function () {});
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 0

  Scenario: synchronous - throws
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(){
          throw new Error('my error');
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1

  Scenario: callback without error
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function (callback) {
          setTimeout(callback);
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 0

  Scenario: callback with error
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function (callback) {
          setTimeout(function() {
            callback(new Error('my error'));
          });
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1

  Scenario: callback asynchronous throws
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(callback){
          setTimeout(function(){
            throw new Error('my error');
          });
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1

  Scenario: promise resolves
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(){
          return {
            then: function(onResolve, onReject) {
              setTimeout(onResolve);
            }
          };
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 0

  Scenario: promise rejects with error
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(){
          return {
            then: function(onResolve, onReject) {
              setTimeout(function () {
                onReject(new Error('my error'));
              });
            }
          };
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1

  Scenario: promise rejects without error
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(){
          return {
            then: function(onResolve, onReject) {
              setTimeout(onReject);
            }
          };
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1

  Scenario: promise asynchronous throws
    Given a file named "features/step_definitions/my_steps.js" with:
      """
      stepDefinitions = function() {
        this.When(/^a step$/, function(){
          return {
            then: function(onResolve, onReject) {
              setTimeout(function(){
                throw new Error('my error');
              });
            }
          };
        });
      };

      module.exports = stepDefinitions
      """
    When I run cucumber.js
    And the exit status should be 1
