import Creature from './Creature';
import { getRandEl } from '../utils';

export default class Adversary extends Creature{
  constructor(location, name, imgPath, movesPerTurn = 2) {
    super(location, imgPath, name);
    this.imgPath = 'https://api.time.com/wp-content/uploads/2019/05/seagulltrafficreporter.jpg';
    this.movesPerTurn = movesPerTurn;
  }

  isNextToRaccoon(raccoon) {
    return this.location.isAdjacentTo(raccoon.location);
  }

  robRaccoon(raccoon) {
    const ingTypes = Object.keys(raccoon.inventory);
    const stolenType = getRandEl(ingTypes);
    const stolenItem = raccoon.inventory[stolenType];

    if (stolenItem) {
      raccoon.inventory[stolenType] = null;
      const alertBox = document.getElementById('alert-box');
      const alert = document.createElement('h3');
      alert.innerText = `They stole your ${stolenItem.name}!`;
      alertBox.appendChild(alert);
      alertBox.innerHTML = alert.outerHTML;
      
    }
  }
}