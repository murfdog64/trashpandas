export default class Location {
  constructor(x, y) {
    this.x = +x;
    this.y = +y;
  }

  equals(loc) {
    return loc.x === this.x && loc.y === this.y;
  }

  isAdjacentTo(loc) {
    if(Math.abs(this.x - loc.x) > 1 || Math.abs(this.y - loc.y) > 1) {
      return false;
    } else {
      return true;
    }
  }
}