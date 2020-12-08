export const GRID = {
    cells: [],
    lar: 0,
    long: 0,
    nodeNumber: 0,
    GRID_SIZE: 100,
    init: function(lar, long, width, height) {
      this.cells = [];
      this.lar = lar;
      this.long = long;
      var id = 0;
      for(var i = 0 ; i < long ; ++i) {
        for(var j = 0 ; j < lar ; ++j) {
          this.cells.push({
            id: id,
            x: i * width/long + (width/long)/2,
            y: j * height/lar + (height/lar)/2,
            occupied: false
          });
          id++;
        }
      }
      this.nodeNumber = this.cells.length;
    },

    sqdist: function (a, b) {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    },

    getCell: function (d) {
      return this.cells[d.index];
    },

    getBottomLineCells: function (d) {
      return this.cells
    },
  }