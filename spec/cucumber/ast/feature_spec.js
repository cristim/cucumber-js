require('../../support/spec_helper');

describe("Cucumber.Ast.Feature", function () {
  var Cucumber = requireLib('cucumber');
  var data, description, feature, keyword, line, name, uri;

  beforeEach(function () {
    description = createSpy("description");
    keyword = createSpy("keyword");
    name = createSpy("name");
    line = createSpy("line");
    uri = createSpy("uri");
    data = {
      description: description,
      keyword: keyword,
      location: {line: line},
      name: name,
      scenarioDefinitions: [],
      tags: []
    }
    feature = Cucumber.Ast.Feature(data, uri);
  });

  describe("getKeyword()", function () {
    it("returns the keyword of the feature", function () {
      expect(feature.getKeyword()).toBe(keyword);
    });
  });

  describe("getName()", function () {
    it("returns the name of the feature", function () {
      expect(feature.getName()).toBe(name);
    });
  });

  describe("getDescription()", function () {
    it("returns the description of the feature", function () {
      expect(feature.getDescription()).toBe(description);
    });
  });

  describe("getUri()", function () {
    it("returns the URI of the feature", function () {
      expect(feature.getUri()).toBe(uri);
    });
  });

  describe("getLine()", function () {
    it("returns the line number on which the feature starts", function () {
      expect(feature.getLine()).toBe(line);
    });
  });

  describe("getBackground()", function () {
    it("returns the background when the feature has a background", function () {
      var background = createSpy('background');
      data.background = createSpy('background data');
      spyOn(Cucumber.Ast, 'Background').andReturn(background)
      feature = Cucumber.Ast.Feature(data);
      expect(feature.getBackground()).toBe(background);
    });

    it("returns nothing when the feature does not have a background", function () {
      expect(feature.getBackground()).toBeUndefined();
    });
  });

  describe("hasBackground()", function () {
    it("returns the background when the feature has a background", function () {
      var background = createSpy('background');
      data.background = createSpy('background data');
      spyOn(Cucumber.Ast, 'Background').andReturn(background)
      feature = Cucumber.Ast.Feature(data);
      expect(feature.hasBackground()).toBeTruthy();
    });

    it("returns nothing when the feature does not have a background", function () {
      expect(feature.hasBackground()).toBeFalsy();
    });
  });

  describe("getTags()", function () {
    it("returns the tags when there are tags", function(){
      var tag1        = createSpy('tag1');
      var tag1Data    = createSpy('tag1Data');
      var tag2        = createSpy('tag2');
      var tag2Data    = createSpy('tag2Data');
      data.tags = [tag1Data, tag2Data];
      spyOn(Cucumber.Ast, 'Tag').andCallFake(function(data) {
        if (data === tag1Data)
          return tag1;
        else if (data === tag2Data)
          return tag2;
      });
      feature = Cucumber.Ast.Feature(data);
      expect(feature.getTags()).toEqual([tag1, tag2]);
    });

    it("returns an empty array when then are no tags", function () {
      expect(feature.getTags()).toEqual([]);
    });
  });

  describe("acceptVisitor", function () {
    var visitor, callback;

    beforeEach(function () {
      visitor  = createSpyWithStubs("visitor", {visitStep: null});
      callback = createSpy("callback");
      spyOn(feature, 'instructVisitorToVisitBackground');
      spyOn(feature, 'instructVisitorToVisitScenarios');
    });

    it("instructs the visitor to visit the feature background", function () {
      feature.acceptVisitor(visitor, callback);
      expect(feature.instructVisitorToVisitBackground).toHaveBeenCalledWithValueAsNthParameter(visitor, 1);
      expect(feature.instructVisitorToVisitBackground).toHaveBeenCalledWithAFunctionAsNthParameter(2);
    });

    describe("when the visitor has finished visiting the background", function () {
      var featureStepsVisitCallback;

      beforeEach(function () {
        feature.acceptVisitor(visitor, callback);
        featureStepsVisitCallback = feature.instructVisitorToVisitBackground.mostRecentCall.args[1];
      });

      it("instructs the visitor to visit the feature steps", function () {
        featureStepsVisitCallback();
        expect(feature.instructVisitorToVisitScenarios).toHaveBeenCalledWith(visitor, callback);
      });
    });
  });

  describe("instructVisitorToVisitBackground()", function () {
    var visitor, callback;

    beforeEach(function () {
      visitor  = createSpyWithStubs("visitor", {visitBackground: undefined});
      callback = createSpy("callback");
      spyOn(feature, 'hasBackground');
    });

    it("checks whether the feature has a background", function () {
      feature.instructVisitorToVisitBackground(visitor, callback);
      expect(feature.hasBackground).toHaveBeenCalled();
    });

    describe("when there is a background", function () {
      var background;

      beforeEach(function () {
        background = createSpy("background");
        feature.hasBackground.andReturn(true);
        spyOn(feature, 'getBackground').andReturn(background);
      });

      it("gets the background", function () {
        feature.instructVisitorToVisitBackground(visitor, callback);
        expect(feature.getBackground).toHaveBeenCalled();
      });

      it("instructs the visitor to visit the background", function () {
        feature.instructVisitorToVisitBackground(visitor, callback);
        expect(visitor.visitBackground).toHaveBeenCalledWith(background, callback);
      });

      it("does not call back", function () {
        feature.instructVisitorToVisitBackground(visitor, callback);
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe("when there is no background", function () {
      beforeEach(function () {
        feature.hasBackground.andReturn(false);
      });

      it("calls back", function () {
        feature.instructVisitorToVisitBackground(visitor, callback);
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe("instructVisitorToVisitScenarios()", function () {
    var visitor, callback, scenario1, scenario1Data, scenario2, scenario2Data;

    beforeEach(function () {
      scenario1       = createSpyWithStubs('scenario1', {setBackground: null, addInheritedTags: null});
      scenario1Data   = {type: 'Scenario'}
      scenario2       = createSpyWithStubs('scenario2', {setBackground: null, addInheritedTags: null});
      scenario2Data   = {type: 'Scenario'}
      spyOn(Cucumber.Ast, 'Scenario').andCallFake(function(data) {
        if (data === scenario1Data)
          return scenario1;
        else if (data === scenario2Data)
          return scenario2;
      });
      data.scenarioDefinitions = [scenario1Data, scenario2Data];
      feature = Cucumber.Ast.Feature(data, uri);
      visitor  = createSpyWithStubs("Visitor", {visitScenario: null});
      callback = createSpy("Callback");
      feature.instructVisitorToVisitScenarios(visitor, callback);
    });

    it("tells the visitor to visit the first scenario", function () {
      expect(visitor.visitScenario.callCount).toEqual(1);
      expect(visitor.visitScenario.mostRecentCall.args[0]).toEqual(scenario1);
    })

    describe('after the first scenario has been visited', function(){
      beforeEach(function(){
        visitor.visitScenario.mostRecentCall.args[1]()
      });

      it("tells the visitor to visit the first scenario", function () {
        expect(visitor.visitScenario.callCount).toEqual(2);
        expect(visitor.visitScenario.mostRecentCall.args[0]).toEqual(scenario2);
      });

      describe('after the last scenario has been visited', function(){
        beforeEach(function(){
          visitor.visitScenario.mostRecentCall.args[1]()
        });

        it("executes the callback", function () {
          expect(callback).toHaveBeenCalled();
        });
      });
    });
  });
});
