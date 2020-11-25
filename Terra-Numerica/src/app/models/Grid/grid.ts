export const GRID = {
    cells: [],
    GRID_SIZE: 100,
    init: function(lar, long, width, height) {
      this.cells = [];
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
    },

    sqdist: function (a, b) {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    },

    getCell: function (d) {
      return this.cells[d.index];
    },
  }