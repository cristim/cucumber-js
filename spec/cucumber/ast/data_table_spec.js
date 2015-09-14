require('../../support/spec_helper');

describe("Cucumber.Ast.DataTable", function () {
  var Cucumber = requireLib('cucumber');

  var dataTable, row1, row1Data, row1Raw, row2, row2Data, row2Raw;

  beforeEach(function () {
    row1Raw   = createSpy('row1 raw');
    row1      = createSpyWithStubs('row1', {raw: row1Raw});
    row1Data  = createSpy('row1 data');
    row2Raw   = createSpy('row2 raw');
    row2      = createSpyWithStubs('row2', {raw: row2Raw});
    row2Data  = createSpy('row2 data');
    var data = {
      rows: [row1Data, row2Data]
    };
    spyOn(Cucumber.Ast.DataTable, 'Row').andCallFake(function (data) {
      if (data === row1Data)
        return row1;
      else if (data === row2Data)
        return row2;
    });
    dataTable = Cucumber.Ast.DataTable(data);
  });

  describe("constructor", function () {
    it("creates rows", function () {
      expect(Cucumber.Ast.DataTable.Row).toHaveBeenCalledWith(row1Data);
      expect(Cucumber.Ast.DataTable.Row).toHaveBeenCalledWith(row2Data);
    });
  });

  describe("getContents()", function () {
    it("returns the data table itself", function () {
      expect(dataTable.getContents()).toBe(dataTable);
    });
  });

  describe("raw()", function () {
    it("returns the raw representations in an array", function () {
      expect(dataTable.raw()).toEqual([row1Raw, row2Raw]);
    });
  });

  describe("rows()", function () {
    it("gets the raw representation of the rows without the header", function () {
      var actualRows = dataTable.rows();
      expect(actualRows).toEqual([row2Raw]);
    });
  });

  describe("getRows()", function () {
    it("gets the raw representation of the rows, including the header", function () {
      var actualRows = dataTable.getRows();
      expect(actualRows.length()).toEqual(2);
      expect(actualRows.getAtIndex(0)).toEqual(row1);
      expect(actualRows.getAtIndex(1)).toEqual(row2);
    });

    it("returns a new row collection every time", function () {
      var actualRows1 = dataTable.getRows();
      var actualRows2 = dataTable.getRows();
      expect(actualRows2).toNotBe(actualRows1);
    });
  });

  describe("rowsHash", function () {
    var raw;

    it("returns a hash of the rows", function () {
      raw = [
        ['pig', 'oink'],
        ['cat', 'meow'],
      ];
      spyOn(dataTable, 'raw').andReturn(raw);
      expect(dataTable.rowsHash()).toEqual({pig: 'oink', cat: 'meow'});
    });

    it("fails if the table doesn't have two columns", function () {
      raw = [
        ['one', 'two', 'three'],
        ['cat', 'dog', 'pig']
      ];
      spyOn(dataTable, 'raw').andReturn(raw);
      expect(function () {
        dataTable.rowsHash();
      }).toThrow();
    });
  });

  describe("hashes", function () {
    var raw, rawHashDataTable, hashDataTable;

    beforeEach(function () {
      raw              = createSpy("raw data table");
      rawHashDataTable = createSpy("raw hash data table");
      hashDataTable    = createSpyWithStubs("hash data table", {raw: rawHashDataTable});
      spyOn(dataTable, 'raw').andReturn(raw);
      spyOn(Cucumber.Type, 'HashDataTable').andReturn(hashDataTable);
    });

    it("gets the raw representation of the data table", function () {
      dataTable.hashes();
      expect(dataTable.raw).toHaveBeenCalled();
    });

    it("creates a hash data table based on the raw representation", function () {
      dataTable.hashes();
      expect(Cucumber.Type.HashDataTable).toHaveBeenCalledWith(raw);
    });

    it("gets the raw representation of the hash data table", function () {
      dataTable.hashes();
      expect(hashDataTable.raw).toHaveBeenCalled();
    });

    it("returns the raw hash data table", function () {
      expect(dataTable.hashes()).toBe(rawHashDataTable);
    });
  });
});
