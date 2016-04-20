
//
// Calculate the cell indices where we will randomly place bombs.
//
GameGrid.prototype.createBombs = function() {
    var totalCells = this.cellsPerRow * this.cellsPerRow;
    var bombIndices = [];

    while (bombIndices.length < this.numberOfBombs) {
        var randomIndex = Math.floor(Math.random() * totalCells);
        if (bombIndices.indexOf(randomIndex) == -1) {
            bombIndices.push(randomIndex);
        }
    }
    return bombIndices;
}

//
// A cell in the game.
//
function Cell() {
    this.state = Cell.STATE_COVERED;
    this.value = undefined;
}
Cell.prototype = Object.create(null);
Cell.prototype.constructor = Cell;
Cell.prototype.toString = function() {
    return 'Cell';
}
Cell.STATE_COVERED = "STATE_COVERED";
Cell.STATE_FLAGGED = "STATE_FLAGGED";
Cell.STATE_REVEALED = "STATE_REVEALED";
Cell.STATE_REVEALED_ENDED_GAME = "STATE_REVEALED_ENDED_GAME";


//
// This is called from CTOR. Also can be called to re-initialize the game.
//
GameGrid.prototype.init = function() {

    this.gameOver = false;
    var firstIndexLastRow = this.firstIndexLastRow; 
    var totalCells = this.totalCells; 

    //
    // Store these for later. 
    //
    // NOTE: Only once the user clicks do we need to ask "is this index that the user clicked a bomb?"
    // Well, we do it then or when we are processin a cell where we are asking "how many bombs are near 
    // this cell?".
    //
    this.bombIndices = this.createBombs();

    //
    // Once this method is done, this array will contain all of the cells.
    //
    this.cells = [];

    //
    // Sort the bomb indices
    //
    bombIndices.sort();


    //
    // Visit/create each cell once. 100 cells = 100 visits.
    //
    for (var cellIndex = 0; cellIndex < totalCells; cellIndex++) {
        cells[cellIndex] = new Cell();
    }

    //
    // NOTE #1: We no longer visit all of the bombs and calculate the numbers for the cells surrounding those bombs.
    // Instead, the plan is to just calculate that number value if/when a user clicks on a cell.
    //

    //
    // NOTE #2: We really don't need to mark a cell with a "b" (bomb) until the user clicks on that cell
    // or until we run the calculation that determines the number of bombs surrdounding a cell...
    //

    //
    // Nothing here any more.
    //
  
}
