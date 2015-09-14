require('../../../support/spec_helper');

describe("Cucumber.Ast.DataTable.Row", function () {
  var Cucumber = requireLib('cucumber');

  var cells, line, row;

  beforeEach(function () {
    cells = [{value: 'a'}, {value: 'b'}];
    line  = createSpy("line");
    var data = {
      cells: cells,
      location: {line: line}
    }
    row = Cucumber.Ast.DataTable.Row(data);
  });

  describe("raw()", function () {
    it("returns a copy of the cells", function () {
      expect(row.raw()).not.toBe(cells);
      expect(row.raw()).toEqual(['a', 'b']);
    });
  });

  describe("getLine()", function () {
    it("returns the line number", function () {
      expect(row.getLine()).toBe(line);
    });
  });
});
