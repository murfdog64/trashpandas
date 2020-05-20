import {getRandEl, genRandNum} from '../utils';
import Item from './Item';

export default class Trashcan {
  constructor(location) {
    this.location = location;
    this.turnsTilFresh = 0;
    this.imgPath = 'https://image.shutterstock.com/image-vector/vector-illustration-trash-can-260nw-133381535.jpg';
  }

  tryYield() {
    if(this.turnsTilFresh) {
      return null;
    }
    const ingredients = {
      bread: ['kaiser roll', 'rye', 'focaccia'],
      meat: ['ham', 'turducken', 'spam'],
      condiment: ['catsup', 'ketchup', 'red sauce'],
      greens: ['lettuce', 'spinach', 'kale'],
      veggies: ['tomato', 'olives', 'onion'],
      cheese: ['colby jack', 'cheddar', 'cheesewiz'],
    };
    const randType = getRandEl(Object.keys(ingredients));
    const randIngredient = getRandEl(ingredients[randType]);
    const newItem = new Item(randType, randIngredient);
    this.turnsTilFresh = 10;
    return newItem;
  }

  freshen() {
    if (this.turnsTilFresh) {
      this.turnsTilFresh--;
    }
  }

  checkFresh() {
    if (this.turnsTilFresh !== 0) {
      this.imgPath = 'https://www.clipartwiki.com/clipimg/detail/12-125328_collection-of-free-transparent-transparent-garbage-bin-cartoon.png';
    } else {
      this.imgPath = 'https://image.shutterstock.com/image-vector/vector-illustration-trash-can-260nw-133381535.jpg';
    }
  }
}