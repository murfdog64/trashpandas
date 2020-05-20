import {genRandNum, getRandEl} from '../utils';
import Location from './Location';
import Raccoon from './Raccoon';
import Adversary from './Adversary';
import TrashCan from './TrashCan';


export default class Game {
  constructor(gameId) {
    this.gameId = gameId;
    this.status = 'new';
    this.turnsLeft = 100;
    this.grid = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    //generate starting locations for each thing in the grid
    const startingLocs = this.genStartLocs();
    //create trashcans, raccoon, and adversary with starting locs
    this.trashCans = Array(5)
      .fill(null)
      .map((_, idx) => new TrashCan(startingLocs[idx]));
    this.raccoon = new Raccoon(startingLocs[5], 'Jerry');
    this.adversary = new Adversary(startingLocs[6], 'Susan');

    //save trashcans, raccoon, and adversary into grid property
    this.grid[this.raccoon.location.y][this.raccoon.location.x] =
    this.raccoon;
    this.grid[this.adversary.location.y][this.adversary.location.x] =
    this.adversary;
    this.trashCans.forEach((tc) => (this.grid[tc.location.y][tc.location.x] = tc));
    console.table(this.grid);

    this.populateGrid();
  }

  genStartLocs() {
    const genLoc = () => `${genRandNum(0,7)}${genRandNum(0,7)}`;
    const randLocs = [];
    while(randLocs.length < 7) {
      const randLoc = genLoc();
      if (!(randLoc in randLocs)) {
        randLocs.push(randLoc);
      }
    }
    return randLocs.map((loc) => new Location(loc[1], loc[0]));
  }

  populateGrid() {
    const game = document.getElementById(this.gameId);
    const gridRoot = game.querySelector('.grid');

    gridRoot.innerHTML = '';

    for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
      const row = document.createElement('div');
      row.classList.add('row');
      for (let colIdx = 0; colIdx < 8; colIdx++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `${rowIdx}${colIdx}`;
        if(this.isOccupied(new Location(colIdx, rowIdx))) {
          const img = document.createElement('img');
          img.src = this.grid[rowIdx][colIdx].imgPath;
          square.appendChild(img);
        }
        row.appendChild(square);
      }
      gridRoot.appendChild(row);
      this.handleTurns();
    }
  }

  handleMove(dir) {
    if(['won', 'lost'].includes(this.status)) {
      return;
    } else {
      this.status = 'running';
    }

    let newLoc;
    const {x, y} = this.raccoon.location;
    switch(dir) {
      case 'left':
        newLoc = new Location(x, y-1);
        break;
      case 'up':
        newLoc = new Location(x-1, y);
        break;
      case 'right':
        newLoc = new Location(x, y+1);
        break;
      case 'down':
        newLoc = new Location(x+1, y);
        break;
      default:
        throw('Bad direction, use arrow keys');
    }

    //raccoon's turn
    if(this.isValidMove(newLoc)){
      this.moveTo(this.raccoon, newLoc);
    }
    this.raccoon.rummage(this.trashCans);

    this.updateInventory();

    //adversary's turn
    let advMoves = 0;
    while (advMoves <= 2) {
      if(this.adversary.isNextToRaccoon(this.raccoon)) {
        this.adversary.robRaccoon(this.raccoon);
        break;
      } else if (advMoves < 2) {
        const advMove = this.genRandAdversaryMove();
        this.moveTo(this.adversary, advMove);
      }
      advMoves++;
    }

    this.trashCans.forEach(tc => tc.freshen());
    this.trashCans.forEach(tc => tc.checkFresh());

    //check if raccoon won
    const items = Object.values(this.raccoon.inventory);
    const numItems = items.filter(i => i).length;
    if(numItems === 6) {
      alert(`${this.raccoon.name} the raccoon has acheived paninirvana`);
      this.status = 'won';
      return;
    }

    this.turnsLeft--;
    if(!this.turnsLeft && this.status !== 'won') {
      alert(`${this.raccoon.name} the raccoon has failed`)
      this.status = 'lost';
    }

    console.table(this.grid);
    this.populateGrid();
    console.log(this.turnsLeft);
    console.log(this.raccoon.inventory);
  }

  genRandAdversaryMove() {
    const validMoves = this.getValidAdversaryMoves();
    const randMove = getRandEl(validMoves);
    return randMove;
  }

  getValidAdversaryMoves() {
    const validMoves = [];
    const {x, y} = this.adversary.location;
    // if(!this.isOccupied(new Location(x-1, y-1))) {
    //   validMoves.push(new Location(x-1, y-1));
    // }
    for(let rowIdx = y - 1; rowIdx <= y + 1; rowIdx++) {
      for(let colIdx = x - 1; colIdx <= x + 1; colIdx++) {
        if(this.isValidMove(new Location(colIdx, rowIdx))) {
          validMoves.push(new Location(colIdx, rowIdx));
        }
      }
    }

    return validMoves;
  }

  isValidMove(loc) {
    return this.isOnBoard(loc) && !this.isOccupied(loc);
  }

  isOnBoard(loc) {
    return loc.x >= 0 && loc.x <= 7 && loc.y >= 0 && loc.y <= 7;
  }

  isOccupied(loc) {
    return !!this.grid[loc.y][loc.x];
  }

  moveTo(creature, loc) {
    if(!this.isOccupied(loc)) {
      const { x: oldX, y: oldY} = creature.location;
      this.grid[oldY][oldX] = null;
      this.grid[loc.y][loc.x] = creature;
      creature.updateLocation(loc);
    }
  }

  updateInventory() {
    const domInventory = document.getElementById('inventory');
    const currInventory = this.raccoon.inventory;
    domInventory.innerHTML = '';
    // listItem.id = 'list';
    for (const ingredient in currInventory) {
      const specificIngredient = currInventory[ingredient];
      const listItem = document.createElement('p');
      listItem.innerText = specificIngredient ? `${ingredient}: ${specificIngredient.name}` : `${ingredient}: empty`;
      domInventory.appendChild(listItem);
    }
  }

  handleTurns() {
    const turnBox = document.getElementById('turn-count');
    const counter = document.createElement('p');
    counter.innerHTML = `${this.turnsLeft}`;
    turnBox.appendChild(counter);
    turnBox.innerHTML = counter.outerHTML;
  }
}
