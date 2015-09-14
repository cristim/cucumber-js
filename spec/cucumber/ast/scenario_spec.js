require('../../support/spec_helper');

describe("Cucumber.Ast.Scenario", function () {
  var Cucumber = requireLib('cucumber');
  var scenario, steps, keyword, name, description, uri, line, lastStep;

  beforeEach(function () {
    description = createSpy("description");
    keyword     = createSpy("keyword");
    name        = createSpy("name");
    line        = createSpy("line");
    step1       = createSpyWithStubs('step1', {setPreviousStep: true});
    step1Data   = createSpy("step1 data");
    step2       = createSpyWithStubs('step2', {setPreviousStep: true});
    step2Data   = createSpy("step2 data");
    tag1        = createSpy('tag1');
    tag1Data    = createSpy('tag1Data');
    tag2        = createSpy('tag2');
    tag2Data    = createSpy('tag2Data');
    uri         = createSpy("uri");
    var data = {
      description: description,
      keyword: keyword,
      location: {line: line},
      name: name,
      steps: [step1Data, step2Data],
      tags: [tag1Data, tag2Data]
    };
    spyOn(Cucumber.Ast, 'Step').andCallFake(function(data) {
      if (data === step1Data)
        return step1;
      else if (data === step2Data)
        return step2;
    });
    spyOn(Cucumber.Ast, 'Tag').andCallFake(function(data) {
      if (data === tag1Data)
        return tag1;
      else if (data === tag2Data)
        return tag2;
    });
    scenario = Cucumber.Ast.Scenario(data, uri);
  });

  describe("constructor", function () {
    it("creates steps", function () {
      expect(Cucumber.Ast.Step).toHaveBeenCalledWith(step1Data, uri);
      expect(Cucumber.Ast.Step).toHaveBeenCalledWith(step2Data, uri);
    });

    it("sets previous steps", function () {
      expect(step1.setPreviousStep).toHaveBeenCalledWith(undefined);
      expect(step2.setPreviousStep).toHaveBeenCalledWith(step1);
    });

    it("creates tags", function () {
      expect(Cucumber.Ast.Tag).toHaveBeenCalledWith(tag1Data, uri);
      expect(Cucumber.Ast.Tag).toHaveBeenCalledWith(tag2Data, uri);
    });
  });

  describe("getKeyword()", function () {
    it("returns the keyword of the scenario", function () {
      expect(scenario.getKeyword()).toBe(keyword);
    });
  });

  describe("getName()", function () {
    it("returns the name of the scenario", function () {
      expect(scenario.getName()).toBe(name);
    });
  });

  describe("getDescription()", function () {
    it("returns the description of the scenario", function () {
      expect(scenario.getDescription()).toBe(description);
    });
  });

  describe("getUri()", function () {
    it("returns the URI on which the background starts", function () {
      expect(scenario.getUri()).toBe(uri);
    });
  });

  describe("getLine()", function () {
    it("returns the line on which the scenario starts", function () {
      expect(scenario.getLine()).toBe(line);
    });
  });

  describe("getBackground() [setBackground()]", function () {
    it("returns the background that was set as such", function () {
      var background = createSpy("background");
      scenario.setBackground(background);
      expect(scenario.getBackground()).toBe(background);
    });
  });

  describe("getTags()", function () {
    it("returns the tags", function () {
      expect(scenario.getTags()).toEqual([tag1, tag2]);
    });
  });

  describe("acceptVisitor", function () {
    var visitor, callback;

    beforeEach(function () {
      visitor  = createSpyWithStubs("Visitor", {visitStep: null});
      callback = createSpy("Callback");
      spyOn(scenario, 'instructVisitorToVisitBackgroundSteps');
      spyOn(scenario, 'instructVisitorToVisitScenarioSteps');
    });

    it("instructs the visitor to visit the background steps", function () {
      scenario.acceptVisitor(visitor, callback);
      expect(scenario.instructVisitorToVisitBackgroundSteps).toHaveBeenCalledWithValueAsNthParameter(visitor, 1);
      expect(scenario.instructVisitorToVisitBackgroundSteps).toHaveBeenCalledWithAFunctionAsNthParameter(2);
    });

    describe("when the visitor has finished visiting the background steps", function () {
      var backgroundStepsVisitCallback;

      beforeEach(function () {
        scenario.acceptVisitor(visitor, callback);
        backgroundStepsVisitCallback = scenario.instructVisitorToVisitBackgroundSteps.mostRecentCall.args[1];
      });

      it("instructs the visitor to visit the scenario steps", function () {
        backgroundStepsVisitCallback();
        expect(scenario.instructVisitorToVisitScenarioSteps).toHaveBeenCalledWith(visitor, callback);
      });
    });
  });

  describe("instructVisitorToVisitBackgroundSteps()", function () {
    var visitor, callback, backgroundSteps;

    beforeEach(function () {
      visitor         = createSpyWithStubs("Visitor", {visitStep: null});
      callback        = createSpy("Callback");
      spyOn(scenario, 'getBackground');
    });

    it("gets the background", function () {
      scenario.instructVisitorToVisitBackgroundSteps(visitor, callback);
      expect(scenario.getBackground).toHaveBeenCalled();
    });

    describe("when there is a background", function () {
      var background;

      beforeEach(function () {
        backgroundSteps = createSpy("background steps");
        background      = createSpyWithStubs("background", {getSteps: backgroundSteps});
        scenario.getBackground.andReturn(background);
        spyOn(scenario, 'instructVisitorToVisitSteps');
      });

      it("gets the steps from the background", function () {
        scenario.instructVisitorToVisitBackgroundSteps(visitor, callback);
        expect(background.getSteps).toHaveBeenCalled();
      });

      it("instructs the visitor to visit the background steps and callback", function () {
        scenario.instructVisitorToVisitBackgroundSteps(visitor, callback);
        expect(scenario.instructVisitorToVisitSteps).toHaveBeenCalledWith(visitor, backgroundSteps, callback);
      });

      it("does not callback", function () {
        scenario.instructVisitorToVisitBackgroundSteps(visitor, callback);
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe("when there is no background", function () {
      beforeEach(function () {
        scenario.getBackground.andReturn(undefined);
      });

      it("calls back", function () {
        scenario.instructVisitorToVisitBackgroundSteps(visitor, callback);
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe("instructVisitorToVisitScenarioSteps()", function () {
    var visitor, callback;

    beforeEach(function () {
      visitor  = createSpyWithStubs("Visitor", {visitStep: null});
      callback = createSpy("Callback");
      spyOn(scenario, 'instructVisitorToVisitSteps');
    });

    it("instructs the visitor to visit the steps", function () {
      scenario.instructVisitorToVisitScenarioSteps(visitor, callback);
      expect(scenario.instructVisitorToVisitSteps).toHaveBeenCalledWith(visitor, scenario.getSteps(), callback);
    });
  });

  describe("instructVisitorToVisitSteps()", function () {
    var visitor, steps, callback;

    beforeEach(function () {
      visitor  = createSpyWithStubs("visitor", {visitStep: null});
      callback = createSpy("callback");
      steps    = createSpy("steps");
      spyOnStub(steps, 'forEach');
   });

    it("iterates over the steps with a user function", function () {
      scenario.instructVisitorToVisitSteps(visitor, steps, callback);
      expect(steps.forEach).toHaveBeenCalled();
      expect(steps.forEach).toHaveBeenCalledWithAFunctionAsNthParameter(1);
      expect(steps.forEach).toHaveBeenCalledWithValueAsNthParameter(callback, 2);
    });

    describe("for each step", function () {
      var userFunction, step, forEachCallback;

      beforeEach(function () {
        scenario.instructVisitorToVisitSteps(visitor, steps, callback);
        userFunction    = steps.forEach.mostRecentCall.args[0];
        step            = createSpy("a step");
        forEachCallback = createSpy("forEach() callback");
      });

      it("instructs the visitor to visit the step and call back when finished", function () {
        userFunction (step, forEachCallback);
        expect(visitor.visitStep).toHaveBeenCalledWith(step, forEachCallback);
      });
    });
  });
});
