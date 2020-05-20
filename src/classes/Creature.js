export default class Creature {
  constructor(location, imgPath, name) {
    this.location = location;
    this.imgPath = imgPath;
    this.name = name;
  }

  updateLocation(loc) {
    this.location = loc;
  }
}