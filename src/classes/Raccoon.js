import Creature from './Creature';

export default class Raccoon extends Creature{
  constructor(location, name) {
    super(location, 'https://i.pinimg.com/originals/3f/6a/91/3f6a91a4d3bc5fcca10b509415ae61ba.jpg', name);
    this.inventory = {
      bread: null,
      meat: null,
      condiment: null,
      greens: null,
      veggies: null,
      cheese: null,
    }
  }
  rummage(trashCans) {
    const adjacentCans = trashCans.filter(tc => tc.location.isAdjacentTo(this.location));
    for(let i = 0; i < adjacentCans.length; i++) {
      const newItem = adjacentCans[i].tryYield();
      if(newItem){
        this.inventory[newItem.type] = newItem;
        return;
      }
    }
  }
}