
//
// A cell in the game.
//
function Cell() {
    this.state = Cell.STATE_COVERED;
    this.value = 0;
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
// The game grid.
//
function GameGrid(cellsPerRow, numberOfBombs) {

    this.cellsPerRow = cellsPerRow;
    this.totalCells = this.cellsPerRow * this.cellsPerRow;
    this.firstIndexLastRow = this.cellsPerRow * (this.cellsPerRow - 1);
    this.numberOfBombs = numberOfBombs;
    this.cells = [];
    this.gameOver = false;

    //
    // Machinery for calculating adjacent cells.
    //
    
    this.topLeftIndex = function (selfIndex) {
        return selfIndex - cellsPerRow - 1;
    }

    this.topIndex = function (selfIndex) {
        return selfIndex - cellsPerRow;
    }

    this.topRightIndex = function (selfIndex) {
        return selfIndex - cellsPerRow + 1;
    }

    this.rightIndex = function (selfIndex) {
        return selfIndex + 1;
    }

    this.bottomRightIndex = function (selfIndex) {
        return selfIndex + cellsPerRow + 1;
    }

    this.bottomIndex = function (selfIndex) {
        return selfIndex + cellsPerRow;
    }

    this.bottomLeftIndex = function (selfIndex) {
        return selfIndex + cellsPerRow - 1;
    }

    this.leftIndex = function (selfIndex) {
        return selfIndex - 1;
    }

    this.adjacentIndicesCalculator = {
        topLeft: [this.rightIndex, this.bottomRightIndex, this.bottomIndex],
        topEdge: [this.leftIndex, this.bottomLeftIndex, this.bottomIndex, this.bottomRightIndex, this.rightIndex],
        topRight: [this.leftIndex, this.bottomLeftIndex, this.bottomIndex],
        leftEdge: [this.topIndex, this.topRightIndex, this.rightIndex, this.bottomRightIndex, this.bottomIndex],
        rightEdge: [this.topIndex, this.topLeftIndex, this.leftIndex, this.bottomLeftIndex, this.bottomIndex],
        center: [this.leftIndex, this.topLeftIndex, this.topIndex, this.topRightIndex, this.rightIndex, this.bottomRightIndex, this.bottomIndex, this.bottomLeftIndex],
        bottomLeft: [this.topIndex, this.topRightIndex, this.rightIndex],
        bottomEdge: [this.leftIndex, this.topLeftIndex, this.topIndex, this.topRightIndex, this.rightIndex],
        bottomRight: [this.topIndex, this.topLeftIndex, this.leftIndex]
    }
    
    this.init();
}
GameGrid.prototype = Object.create(null);
GameGrid.prototype.constructor = GameGrid;

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
// Calculate where the cell sits on the grid (a text/key such as: "topLeft")
//
GameGrid.prototype.getCellPositionKey = function(bombIndex, firstIndexLastRow) {

    var cellsPerRow = this.cellsPerRow;

    function hasCellsBelow() {
        return bombIndex < firstIndexLastRow;
    }

    function hasCellsAbove() {
        return bombIndex >= cellsPerRow;
    }

    function hasCellsToLeft() {
        //
        // Not on left edge.
        //
        return bombIndex % cellsPerRow !== 0;
    }

    function hasCellsToRight() {
        //
        // Not on right edge.
        //
        return (bombIndex + 1) % cellsPerRow !== 0;
    }

    var cellsBelow = hasCellsBelow(firstIndexLastRow);
    var cellsAbove = hasCellsAbove(cellsPerRow);
    var cellsLeft = hasCellsToLeft(cellsPerRow);
    var cellsRight = hasCellsToRight(cellsPerRow);
    var bombPositionKey = null;

    //
    // There are cells below.
    //
    if (cellsBelow) {

        //
        // This Bomb is on the top row.
        //
        if (!cellsAbove) {
            if (cellsRight && cellsLeft) {
                bombPositionKey = 'topEdge';
            } else if (cellsRight && !cellsLeft) {
                bombPositionKey = 'topLeft';
            } else {
                bombPositionKey = 'topRight';
            }
        } else {
            if (cellsRight && cellsLeft) {
                bombPositionKey = 'center';
            } else if (cellsRight && !cellsLeft) {
                bombPositionKey = 'leftEdge';
            } else {
                bombPositionKey = 'rightEdge';
            }
        }

        //
        // This Bomb is on the bottom row.
        //
    } else {
        if (cellsRight && cellsLeft) {
            bombPositionKey = 'bottomEdge';
        } else if (cellsRight && !cellsLeft) {
            bombPositionKey = 'bottomLeft';
        } else {
            bombPositionKey = 'bottomRight';
        }
    }

    return bombPositionKey;
}

//
// This is called from CTOR. Also can be called to re-initialize the game.
//
GameGrid.prototype.init = function() {

    this.gameOver = false;
    var firstIndexLastRow = this.firstIndexLastRow; 
    var totalCells = this.totalCells; 
    var bombIndices = this.createBombs();
    
    //
    // HARD CODED. REMOVE THIS.
    //
   // bombIndices = [6, 9, 15, 18];

    this.cells = [];
    
    for (var cellIndex = 0; cellIndex < totalCells; cellIndex++) {
        var cell = new Cell();
        this.cells[cellIndex] = cell;
        if (bombIndices.indexOf(cellIndex) !== -1) {
            cell.value = 'b'; // b == bomb
        }
    }

    bombIndices.forEach(function(bombIndex) {
        var bombPositionKey = this.getCellPositionKey(bombIndex, firstIndexLastRow);

        var adjacentIndices = this.adjacentIndicesCalculator[bombPositionKey].map(function(calculateIndex) {
            return calculateIndex(bombIndex)
        });
        
        adjacentIndices.forEach(function(adjacentCellIndex) {
            var adjacentCell = this.cells[adjacentCellIndex];
            if (adjacentCell.value !== 'b') {
               adjacentCell.value += 1;
            }
        },this);
    }, this);
  
}

//
// For debugging.
//
GameGrid.prototype.toString = function() {
    var str = '\n';
    
    var index = 0;
    
    for (var row = 0; row < this.cellsPerRow; row++) {
        for (var col = 0; col < this.cellsPerRow; col++) {
            var cell = this.cells[index];
            //str += '(' + row + ',' + col + ')';
            //str += '(' + row + ',' + col + ', ' + cell.value + ') ';
            if (cell.state === Cell.STATE_FLAGGED) {
                if (cell.value === 'b') {
                    str += '(F' + cell.value + ') ';
                } else {
                    str += '(F) ';
                }
            } else if (cell.state === Cell.STATE_COVERED) {
                str += '(C' + cell.value + ') ';
            } else {
                str += '(' + cell.value + ') ';
            }
            
            index += 1;
        }
        str += '\n';
    }
    return str;
}

//
// Right click should toggle this.
//
GameGrid.prototype.toggleFlagCell = function (row,col) {
    var cellIndex = row*this.cellsPerRow + col;
    var cell = this.cells[cellIndex];
    
    if (cell.state === Cell.STATE_COVERED) {
        console.log('show flagged');
        cell.state = Cell.STATE_FLAGGED;
    } else if (cell.state === Cell.STATE_FLAGGED) {
        cell.state = Cell.STATE_COVERED;
    }
}

//
// Left click selects the cell.
//
GameGrid.prototype.selectCell = function(row,col,skipOverBombs) {
    
    var cellIndex = row*this.cellsPerRow + col;
    var cell = this.cells[cellIndex];

    if (cell.value === 'b') {
        if (!skipOverBombs) {
       cell.state = Cell.STATE_REVEALED_ENDED_GAME;
           console.log('GAME OVER');
           this.gameOver = true;
        }
    } else {
        
        if (cell.state !== Cell.STATE_REVEALED) {
            if (cell.value > 0) {
                cell.state = Cell.STATE_REVEALED;
            } else {
                cell.state = Cell.STATE_REVEALED;
                
                var cellPositionKey = this.getCellPositionKey(cellIndex, this.firstIndexLastRow);
        
                var adjacentCellIndices = 
                   this.adjacentIndicesCalculator[cellPositionKey].map(function(calculateIndex) {
                       return calculateIndex(cellIndex)
                });


                adjacentCellIndices.forEach(function(adjacentCellIndex) {
                    if (adjacentCellIndex >= 0 && adjacentCellIndex < this.totalCells) {
                       var col = adjacentCellIndex % this.cellsPerRow;
                       var row = Math.floor(adjacentCellIndex/this.cellsPerRow);
                       this.selectCell(row,col,true);
                    }
                },this)
            }
        }
    }
}



